var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
/// <reference path="./types.d.ts" />
define("node_modules/decentraland-builder-scripts/channel", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createChannel = void 0;
    var REQUEST_VALUE = '__request_value__';
    var REPLY_VALUE = '__reply_value__';
    var POLL_INTERVAL = 5000;
    function createChannel(id, host, bus) {
        var handlers = {};
        var requests = {};
        var responses = {};
        bus.on(host.name, function (action) {
            var handler = handlers[action.actionId];
            if (handler) {
                handler(action);
            }
            // clear all pending requests for this entity
            requests = {};
        });
        bus.on(REQUEST_VALUE, function (message) {
            if (message.sender !== id && message.entityName === host.name) {
                var key = message.key;
                var response = responses[key];
                if (response) {
                    var value = response();
                    var reply = {
                        entityName: host.name,
                        key: key,
                        sender: id,
                        value: value
                    };
                    bus.emit(REPLY_VALUE, reply);
                }
                // clear pending request for this key
                delete requests[key];
            }
        });
        bus.on(REPLY_VALUE, function (message) {
            if (message.sender !== id && message.entityName === host.name) {
                var key = message.key, value = message.value;
                var request = requests[key];
                if (request) {
                    request(value);
                }
                // clear pending request for this key
                delete requests[key];
            }
        });
        return {
            id: id,
            bus: bus,
            createAction: function (actionId, values) {
                var action = {
                    entityName: host.name,
                    actionId: actionId,
                    values: values
                };
                return action;
            },
            sendActions: function (actions) {
                var e_1, _a;
                if (actions === void 0) { actions = []; }
                try {
                    for (var actions_1 = __values(actions), actions_1_1 = actions_1.next(); !actions_1_1.done; actions_1_1 = actions_1.next()) {
                        var base = actions_1_1.value;
                        var action = __assign(__assign({}, base), { sender: id });
                        bus.emit(action.entityName, action);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (actions_1_1 && !actions_1_1.done && (_a = actions_1.return)) _a.call(actions_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            },
            handleAction: function (actionId, handler) {
                handlers[actionId] = handler;
            },
            request: function (key, callback) {
                requests[key] = callback;
                var request = { entityName: host.name, key: key, sender: id };
                var interval = setInterval(function () {
                    if (key in requests) {
                        bus.emit(REQUEST_VALUE, request);
                    }
                    else {
                        clearInterval(interval);
                    }
                }, POLL_INTERVAL);
            },
            reply: function (key, callback) {
                responses[key] = callback;
            }
        };
    }
    exports.createChannel = createChannel;
});
/// <reference path="./types.d.ts" />
define("node_modules/decentraland-builder-scripts/inventory", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createInventory = void 0;
    function createInventory(UICanvas, UIContainerStack, UIImage) {
        var canvas = null;
        var container = null;
        var images = {};
        function getContainer() {
            if (!canvas) {
                canvas = new UICanvas();
            }
            if (!container) {
                container = new UIContainerStack(canvas);
                container.isPointerBlocker = false;
                container.vAlign = 'bottom';
                container.hAlign = 'right';
                container.stackOrientation = 0;
                container.spacing = 0;
                container.positionY = 75;
                container.positionX = -25;
            }
            return container;
        }
        return {
            add: function (id, texture) {
                var image = images[id] || new UIImage(getContainer(), texture);
                image.width = 128;
                image.height = 128;
                image.sourceTop = 0;
                image.sourceLeft = 0;
                image.sourceHeight = 256;
                image.sourceWidth = 256;
                image.isPointerBlocker = false;
                image.visible = true;
                images[id] = image;
            },
            remove: function (id) {
                var image = images[id];
                if (image) {
                    image.visible = false;
                    image.height = 0;
                    image.width = 0;
                }
            },
            has: function (id) {
                return id in images && images[id].visible;
            }
        };
    }
    exports.createInventory = createInventory;
});
define("Image Billboard Black/src/item", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SignPost = /** @class */ (function () {
        function SignPost() {
        }
        SignPost.prototype.init = function () {
        };
        SignPost.prototype.spawn = function (host, props, channel) {
            var sign = new Entity();
            sign.setParent(host);
            sign.addComponent(new GLTFShape("Image Billboard Black/models/Billboard_Black.glb"));
            sign.addComponent(new Transform({}));
            var url = props.image;
            var QRTexture = new Texture(url);
            var QRMaterial = new Material();
            QRMaterial.metallic = 0;
            QRMaterial.roughness = 1;
            QRMaterial.specularIntensity = 0;
            QRMaterial.albedoTexture = QRTexture;
            var QRPlane = new Entity();
            QRPlane.setParent(host);
            QRPlane.addComponent(new PlaneShape());
            QRPlane.addComponent(QRMaterial);
            QRPlane.addComponent(new Transform({
                position: new Vector3(0, 3.852, 0.21),
                rotation: Quaternion.Euler(180, 0, 0),
                scale: new Vector3(2.3, 2.3, 2.3)
            }));
            var QRPlane2 = new Entity();
            QRPlane2.setParent(host);
            QRPlane2.addComponent(new PlaneShape());
            QRPlane2.addComponent(QRMaterial);
            QRPlane2.addComponent(new Transform({
                position: new Vector3(0, 3.852, -0.21),
                rotation: Quaternion.Euler(180, 180, 0),
                scale: new Vector3(2.3, 2.3, 2.3)
            }));
        };
        return SignPost;
    }());
    exports.default = SignPost;
});
define("src/game", ["require", "exports", "node_modules/decentraland-builder-scripts/channel", "node_modules/decentraland-builder-scripts/inventory", "Image Billboard Black/src/item"], function (require, exports, channel_1, inventory_1, item_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var _scene = new Entity("_scene");
    engine.addEntity(_scene);
    var transform = new Transform({
        position: new Vector3(0, 0, 0),
        rotation: new Quaternion(0, 0, 0, 1),
        scale: new Vector3(1, 1, 1)
    });
    _scene.addComponentOrReplace(transform);
    var entity = new Entity("entity");
    engine.addEntity(entity);
    entity.setParent(_scene);
    var gltfShape = new GLTFShape("Floor/FloorBaseGrass_01/FloorBaseGrass_01.glb");
    gltfShape.withCollisions = true;
    gltfShape.isPointerBlocker = true;
    gltfShape.visible = true;
    entity.addComponentOrReplace(gltfShape);
    var transform2 = new Transform({
        position: new Vector3(8, 0, 8),
        rotation: new Quaternion(0, 0, 0, 1),
        scale: new Vector3(1, 1, 1)
    });
    entity.addComponentOrReplace(transform2);
    var imageBillboardBlack = new Entity("imageBillboardBlack");
    engine.addEntity(imageBillboardBlack);
    imageBillboardBlack.setParent(_scene);
    var transform3 = new Transform({
        position: new Vector3(8, 0, 8),
        rotation: new Quaternion(0, 0, 0, 1),
        scale: new Vector3(1, 1, 1)
    });
    imageBillboardBlack.addComponentOrReplace(transform3);
    var channelId = Math.random().toString(16).slice(2);
    var channelBus = new MessageBus();
    var inventory = inventory_1.createInventory(UICanvas, UIContainerStack, UIImage);
    var options = { inventory: inventory };
    var script1 = new item_1.default();
    // @ts-ignore
    script1.init(options);
    script1.spawn(imageBillboardBlack, {
        image: "https://ipfs.infura.io/ipfs/QmSgUvUipiy9TnJ9nWgDDcTxXpUxpC3hAAdGYCzn5uRjiq"
    }, channel_1.createChannel(channelId, imageBillboardBlack, channelBus));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9kZWNlbnRyYWxhbmQtYnVpbGRlci1zY3JpcHRzL2NoYW5uZWwudHMiLCIuLi9ub2RlX21vZHVsZXMvZGVjZW50cmFsYW5kLWJ1aWxkZXItc2NyaXB0cy9pbnZlbnRvcnkudHMiLCIuLi9JbWFnZSBCaWxsYm9hcmQgQmxhY2svc3JjL2l0ZW0udHMiLCIuLi9zcmMvZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscUNBQXFDOzs7OztJQWVyQyxJQUFNLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQTtJQUN6QyxJQUFNLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQTtJQUNyQyxJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUE7SUFLMUIsU0FBZ0IsYUFBYSxDQUFDLEVBQVUsRUFBRSxJQUFTLEVBQUUsR0FBUTtRQUMzRCxJQUFNLFFBQVEsR0FBMEMsRUFBRSxDQUFBO1FBQzFELElBQUksUUFBUSxHQUF5QyxFQUFFLENBQUE7UUFDdkQsSUFBTSxTQUFTLEdBQThCLEVBQUUsQ0FBQTtRQUUvQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBQyxNQUFtQjtZQUNwQyxJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ3pDLElBQUksT0FBTyxFQUFFO2dCQUNYLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTthQUNoQjtZQUNELDZDQUE2QztZQUM3QyxRQUFRLEdBQUcsRUFBRSxDQUFBO1FBQ2YsQ0FBQyxDQUFDLENBQUE7UUFFRixHQUFHLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxVQUFDLE9BQXVCO1lBQzVDLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxFQUFFLElBQUksT0FBTyxDQUFDLFVBQVUsS0FBSyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNyRCxJQUFB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LENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEQsSUFBTSxVQUFVLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztJQUNwQyxJQUFNLFNBQVMsR0FBRywyQkFBZSxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2RSxJQUFNLE9BQU8sR0FBRyxFQUFFLFNBQVMsV0FBQSxFQUFFLENBQUM7SUFFOUIsSUFBTSxPQUFPLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztJQUM5QixhQUFhO0lBQ2IsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0QixPQUFPLENBQUMsS0FBSyxDQUNYLG1CQUFtQixFQUNuQjtRQUNFLEtBQUssRUFDSCw0RUFBNEU7S0FDL0UsRUFDRCx1QkFBYSxDQUFDLFNBQVMsRUFBRSxtQkFBbUIsRUFBRSxVQUFVLENBQUMsQ0FDMUQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3R5cGVzLmQudHNcIiAvPlxuXG50eXBlIFJlcXVlc3RNZXNzYWdlID0ge1xuICBlbnRpdHlOYW1lOiBzdHJpbmdcbiAga2V5OiBzdHJpbmdcbiAgc2VuZGVyOiBzdHJpbmdcbn1cblxudHlwZSBSZXBseU1lc3NhZ2UgPSB7XG4gIGVudGl0eU5hbWU6IHN0cmluZ1xuICBrZXk6IHN0cmluZ1xuICBzZW5kZXI6IHN0cmluZ1xuICB2YWx1ZTogc3RyaW5nXG59XG5cbmNvbnN0IFJFUVVFU1RfVkFMVUUgPSAnX19yZXF1ZXN0X3ZhbHVlX18nXG5jb25zdCBSRVBMWV9WQUxVRSA9ICdfX3JlcGx5X3ZhbHVlX18nXG5jb25zdCBQT0xMX0lOVEVSVkFMID0gNTAwMFxuXG5kZWNsYXJlIHZhciBzZXRJbnRlcnZhbDogYW55XG5kZWNsYXJlIHZhciBjbGVhckludGVydmFsOiBhbnlcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNoYW5uZWwoaWQ6IHN0cmluZywgaG9zdDogYW55LCBidXM6IEJ1cyk6IElDaGFubmVsIHtcbiAgY29uc3QgaGFuZGxlcnM6IFJlY29yZDxzdHJpbmcsICh2YWx1ZXM6IGFueSkgPT4gdm9pZD4gPSB7fVxuICBsZXQgcmVxdWVzdHM6IFJlY29yZDxzdHJpbmcsICh2YWx1ZTogYW55KSA9PiB2b2lkPiA9IHt9XG4gIGNvbnN0IHJlc3BvbnNlczogUmVjb3JkPHN0cmluZywgKCkgPT4gYW55PiA9IHt9XG5cbiAgYnVzLm9uKGhvc3QubmFtZSwgKGFjdGlvbjogQWN0aW9uPGFueT4pID0+IHtcbiAgICBjb25zdCBoYW5kbGVyID0gaGFuZGxlcnNbYWN0aW9uLmFjdGlvbklkXVxuICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICBoYW5kbGVyKGFjdGlvbilcbiAgICB9XG4gICAgLy8gY2xlYXIgYWxsIHBlbmRpbmcgcmVxdWVzdHMgZm9yIHRoaXMgZW50aXR5XG4gICAgcmVxdWVzdHMgPSB7fVxuICB9KVxuXG4gIGJ1cy5vbihSRVFVRVNUX1ZBTFVFLCAobWVzc2FnZTogUmVxdWVzdE1lc3NhZ2UpID0+IHtcbiAgICBpZiAobWVzc2FnZS5zZW5kZXIgIT09IGlkICYmIG1lc3NhZ2UuZW50aXR5TmFtZSA9PT0gaG9zdC5uYW1lKSB7XG4gICAgICBjb25zdCB7IGtleSB9ID0gbWVzc2FnZVxuICAgICAgY29uc3QgcmVzcG9uc2UgPSByZXNwb25zZXNba2V5XVxuICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gcmVzcG9uc2UoKVxuICAgICAgICBjb25zdCByZXBseTogUmVwbHlNZXNzYWdlID0ge1xuICAgICAgICAgIGVudGl0eU5hbWU6IGhvc3QubmFtZSxcbiAgICAgICAgICBrZXksXG4gICAgICAgICAgc2VuZGVyOiBpZCxcbiAgICAgICAgICB2YWx1ZVxuICAgICAgICB9XG4gICAgICAgIGJ1cy5lbWl0KFJFUExZX1ZBTFVFLCByZXBseSlcbiAgICAgIH1cbiAgICAgIC8vIGNsZWFyIHBlbmRpbmcgcmVxdWVzdCBmb3IgdGhpcyBrZXlcbiAgICAgIGRlbGV0ZSByZXF1ZXN0c1trZXldXG4gICAgfVxuICB9KVxuXG4gIGJ1cy5vbihSRVBMWV9WQUxVRSwgKG1lc3NhZ2U6IFJlcGx5TWVzc2FnZSkgPT4ge1xuICAgIGlmIChtZXNzYWdlLnNlbmRlciAhPT0gaWQgJiYgbWVzc2FnZS5lbnRpdHlOYW1lID09PSBob3N0Lm5hbWUpIHtcbiAgICAgIGNvbnN0IHsga2V5LCB2YWx1ZSB9ID0gbWVzc2FnZVxuICAgICAgY29uc3QgcmVxdWVzdCA9IHJlcXVlc3RzW2tleV1cbiAgICAgIGlmIChyZXF1ZXN0KSB7XG4gICAgICAgIHJlcXVlc3QodmFsdWUpXG4gICAgICB9XG4gICAgICAvLyBjbGVhciBwZW5kaW5nIHJlcXVlc3QgZm9yIHRoaXMga2V5XG4gICAgICBkZWxldGUgcmVxdWVzdHNba2V5XVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4ge1xuICAgIGlkLFxuICAgIGJ1cyxcbiAgICBjcmVhdGVBY3Rpb248VCBleHRlbmRzIHt9PihhY3Rpb25JZDogc3RyaW5nLCB2YWx1ZXM6IFQpIHtcbiAgICAgIGNvbnN0IGFjdGlvbjogQmFzZUFjdGlvbjxUPiA9IHtcbiAgICAgICAgZW50aXR5TmFtZTogaG9zdC5uYW1lLFxuICAgICAgICBhY3Rpb25JZCxcbiAgICAgICAgdmFsdWVzXG4gICAgICB9XG4gICAgICByZXR1cm4gYWN0aW9uXG4gICAgfSxcbiAgICBzZW5kQWN0aW9ucyhhY3Rpb25zOiBBY3Rpb25zID0gW10pIHtcbiAgICAgIGZvciAoY29uc3QgYmFzZSBvZiBhY3Rpb25zKSB7XG4gICAgICAgIGNvbnN0IGFjdGlvbjogQWN0aW9uPGFueT4gPSB7IC4uLmJhc2UsIHNlbmRlcjogaWQgfVxuICAgICAgICBidXMuZW1pdChhY3Rpb24uZW50aXR5TmFtZSwgYWN0aW9uKVxuICAgICAgfVxuICAgIH0sXG4gICAgaGFuZGxlQWN0aW9uPFQ+KGFjdGlvbklkOiBzdHJpbmcsIGhhbmRsZXI6ICh2YWx1ZXM6IFQpID0+IHZvaWQpIHtcbiAgICAgIGhhbmRsZXJzW2FjdGlvbklkXSA9IGhhbmRsZXJcbiAgICB9LFxuICAgIHJlcXVlc3Q8VD4oa2V5OiBzdHJpbmcsIGNhbGxiYWNrOiAodmFsdWU6IFQpID0+IHZvaWQpIHtcbiAgICAgIHJlcXVlc3RzW2tleV0gPSBjYWxsYmFja1xuICAgICAgY29uc3QgcmVxdWVzdDogUmVxdWVzdE1lc3NhZ2UgPSB7IGVudGl0eU5hbWU6IGhvc3QubmFtZSwga2V5LCBzZW5kZXI6IGlkIH1cbiAgICAgIGNvbnN0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBpZiAoa2V5IGluIHJlcXVlc3RzKSB7XG4gICAgICAgICAgYnVzLmVtaXQoUkVRVUVTVF9WQUxVRSwgcmVxdWVzdClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKVxuICAgICAgICB9XG4gICAgICB9LCBQT0xMX0lOVEVSVkFMKVxuICAgIH0sXG4gICAgcmVwbHk8VD4oa2V5OiBzdHJpbmcsIGNhbGxiYWNrOiAoKSA9PiBUKSB7XG4gICAgICByZXNwb25zZXNba2V5XSA9IGNhbGxiYWNrXG4gICAgfVxuICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eXBlcy5kLnRzXCIgLz5cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUludmVudG9yeShcbiAgVUlDYW52YXM6IGFueSxcbiAgVUlDb250YWluZXJTdGFjazogYW55LFxuICBVSUltYWdlOiBhbnlcbik6IElJbnZlbnRvcnkge1xuICBsZXQgY2FudmFzOiBhbnkgPSBudWxsXG4gIGxldCBjb250YWluZXI6IGFueSA9IG51bGxcbiAgbGV0IGltYWdlczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9XG5cbiAgZnVuY3Rpb24gZ2V0Q29udGFpbmVyKCkge1xuICAgIGlmICghY2FudmFzKSB7XG4gICAgICBjYW52YXMgPSBuZXcgVUlDYW52YXMoKVxuICAgIH1cbiAgICBpZiAoIWNvbnRhaW5lcikge1xuICAgICAgY29udGFpbmVyID0gbmV3IFVJQ29udGFpbmVyU3RhY2soY2FudmFzKVxuICAgICAgY29udGFpbmVyLmlzUG9pbnRlckJsb2NrZXIgPSBmYWxzZVxuICAgICAgY29udGFpbmVyLnZBbGlnbiA9ICdib3R0b20nXG4gICAgICBjb250YWluZXIuaEFsaWduID0gJ3JpZ2h0J1xuICAgICAgY29udGFpbmVyLnN0YWNrT3JpZW50YXRpb24gPSAwXG4gICAgICBjb250YWluZXIuc3BhY2luZyA9IDBcbiAgICAgIGNvbnRhaW5lci5wb3NpdGlvblkgPSA3NVxuICAgICAgY29udGFpbmVyLnBvc2l0aW9uWCA9IC0yNVxuICAgIH1cbiAgICByZXR1cm4gY29udGFpbmVyXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGFkZChpZDogc3RyaW5nLCB0ZXh0dXJlOiBhbnkpIHtcbiAgICAgIGNvbnN0IGltYWdlID0gaW1hZ2VzW2lkXSB8fCBuZXcgVUlJbWFnZShnZXRDb250YWluZXIoKSwgdGV4dHVyZSlcbiAgICAgIGltYWdlLndpZHRoID0gMTI4XG4gICAgICBpbWFnZS5oZWlnaHQgPSAxMjhcbiAgICAgIGltYWdlLnNvdXJjZVRvcCA9IDBcbiAgICAgIGltYWdlLnNvdXJjZUxlZnQgPSAwXG4gICAgICBpbWFnZS5zb3VyY2VIZWlnaHQgPSAyNTZcbiAgICAgIGltYWdlLnNvdXJjZVdpZHRoID0gMjU2XG4gICAgICBpbWFnZS5pc1BvaW50ZXJCbG9ja2VyID0gZmFsc2VcbiAgICAgIGltYWdlLnZpc2libGUgPSB0cnVlXG4gICAgICBpbWFnZXNbaWRdID0gaW1hZ2VcbiAgICB9LFxuXG4gICAgcmVtb3ZlKGlkOiBzdHJpbmcpIHtcbiAgICAgIGNvbnN0IGltYWdlID0gaW1hZ2VzW2lkXVxuICAgICAgaWYgKGltYWdlKSB7XG4gICAgICAgIGltYWdlLnZpc2libGUgPSBmYWxzZVxuICAgICAgICBpbWFnZS5oZWlnaHQgPSAwXG4gICAgICAgIGltYWdlLndpZHRoID0gMFxuICAgICAgfVxuICAgIH0sXG5cbiAgICBoYXMoaWQ6IHN0cmluZykge1xuICAgICAgcmV0dXJuIGlkIGluIGltYWdlcyAmJiBpbWFnZXNbaWRdLnZpc2libGVcbiAgICB9XG4gIH1cbn1cbiIsImV4cG9ydCB0eXBlIFByb3BzID0ge1xuICBpbWFnZTogc3RyaW5nXG59XG5cbnR5cGUgQ2hhbmdlVGV4dFR5cGUgPSB7IG5ld1RleHQ6IHN0cmluZyB9XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpZ25Qb3N0IGltcGxlbWVudHMgSVNjcmlwdDxQcm9wcz4ge1xuICBpbml0KCkge1xuICB9XG5cbiAgc3Bhd24oaG9zdDogRW50aXR5LCBwcm9wczogUHJvcHMsIGNoYW5uZWw6IElDaGFubmVsKSB7XG4gICAgY29uc3Qgc2lnbiA9IG5ldyBFbnRpdHkoKTtcbiAgICBzaWduLnNldFBhcmVudChob3N0KTtcblxuICAgIHNpZ24uYWRkQ29tcG9uZW50KG5ldyBHTFRGU2hhcGUoXCJJbWFnZSBCaWxsYm9hcmQgQmxhY2svbW9kZWxzL0JpbGxib2FyZF9CbGFjay5nbGJcIikpO1xuICAgIHNpZ24uYWRkQ29tcG9uZW50KG5ldyBUcmFuc2Zvcm0oe30pKTtcblxuICAgIGxldCB1cmwgPSBwcm9wcy5pbWFnZTtcblxuICAgIGxldCBRUlRleHR1cmUgPSBuZXcgVGV4dHVyZSh1cmwpO1xuICAgIGxldCBRUk1hdGVyaWFsID0gbmV3IE1hdGVyaWFsKCk7XG4gICAgUVJNYXRlcmlhbC5tZXRhbGxpYyA9IDA7XG4gICAgUVJNYXRlcmlhbC5yb3VnaG5lc3MgPSAxO1xuICAgIFFSTWF0ZXJpYWwuc3BlY3VsYXJJbnRlbnNpdHkgPSAwO1xuICAgIFFSTWF0ZXJpYWwuYWxiZWRvVGV4dHVyZSA9IFFSVGV4dHVyZTtcblxuICAgIGxldCBRUlBsYW5lID0gbmV3IEVudGl0eSgpO1xuICAgIFFSUGxhbmUuc2V0UGFyZW50KGhvc3QpO1xuICAgIFFSUGxhbmUuYWRkQ29tcG9uZW50KG5ldyBQbGFuZVNoYXBlKCkpO1xuICAgIFFSUGxhbmUuYWRkQ29tcG9uZW50KFFSTWF0ZXJpYWwpO1xuICAgIFFSUGxhbmUuYWRkQ29tcG9uZW50KFxuICAgICAgbmV3IFRyYW5zZm9ybSh7XG4gICAgICAgIHBvc2l0aW9uOiBuZXcgVmVjdG9yMygwLCAzLjg1MiwgMC4yMSksXG4gICAgICAgIHJvdGF0aW9uOiBRdWF0ZXJuaW9uLkV1bGVyKDE4MCwgMCwgMCksXG4gICAgICAgIHNjYWxlOiBuZXcgVmVjdG9yMygyLjMsIDIuMywgMi4zKVxuICAgICAgfSlcbiAgICApO1xuICAgIGxldCBRUlBsYW5lMiA9IG5ldyBFbnRpdHkoKTtcbiAgICBRUlBsYW5lMi5zZXRQYXJlbnQoaG9zdCk7XG4gICAgUVJQbGFuZTIuYWRkQ29tcG9uZW50KG5ldyBQbGFuZVNoYXBlKCkpO1xuICAgIFFSUGxhbmUyLmFkZENvbXBvbmVudChRUk1hdGVyaWFsKTtcbiAgICBRUlBsYW5lMi5hZGRDb21wb25lbnQoXG4gICAgICBuZXcgVHJhbnNmb3JtKHtcbiAgICAgICAgcG9zaXRpb246IG5ldyBWZWN0b3IzKDAsIDMuODUyLCAtMC4yMSksXG4gICAgICAgIHJvdGF0aW9uOiBRdWF0ZXJuaW9uLkV1bGVyKDE4MCwgMTgwLCAwKSxcbiAgICAgICAgc2NhbGU6IG5ldyBWZWN0b3IzKDIuMywgMi4zLCAyLjMpXG4gICAgICB9KVxuICAgICk7XG4gIH1cbn0iLCJpbXBvcnQgeyBjcmVhdGVDaGFubmVsIH0gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9kZWNlbnRyYWxhbmQtYnVpbGRlci1zY3JpcHRzL2NoYW5uZWxcIjtcbmltcG9ydCB7IGNyZWF0ZUludmVudG9yeSB9IGZyb20gXCIuLi9ub2RlX21vZHVsZXMvZGVjZW50cmFsYW5kLWJ1aWxkZXItc2NyaXB0cy9pbnZlbnRvcnlcIjtcbmltcG9ydCBTY3JpcHQxIGZyb20gXCIuLi9JbWFnZSBCaWxsYm9hcmQgQmxhY2svc3JjL2l0ZW1cIjtcblxuY29uc3QgX3NjZW5lID0gbmV3IEVudGl0eShcIl9zY2VuZVwiKTtcbmVuZ2luZS5hZGRFbnRpdHkoX3NjZW5lKTtcbmNvbnN0IHRyYW5zZm9ybSA9IG5ldyBUcmFuc2Zvcm0oe1xuICBwb3NpdGlvbjogbmV3IFZlY3RvcjMoMCwgMCwgMCksXG4gIHJvdGF0aW9uOiBuZXcgUXVhdGVybmlvbigwLCAwLCAwLCAxKSxcbiAgc2NhbGU6IG5ldyBWZWN0b3IzKDEsIDEsIDEpXG59KTtcbl9zY2VuZS5hZGRDb21wb25lbnRPclJlcGxhY2UodHJhbnNmb3JtKTtcblxuY29uc3QgZW50aXR5ID0gbmV3IEVudGl0eShcImVudGl0eVwiKTtcbmVuZ2luZS5hZGRFbnRpdHkoZW50aXR5KTtcbmVudGl0eS5zZXRQYXJlbnQoX3NjZW5lKTtcbmNvbnN0IGdsdGZTaGFwZSA9IG5ldyBHTFRGU2hhcGUoXG4gIFwiRmxvb3IvRmxvb3JCYXNlR3Jhc3NfMDEvRmxvb3JCYXNlR3Jhc3NfMDEuZ2xiXCJcbik7XG5nbHRmU2hhcGUud2l0aENvbGxpc2lvbnMgPSB0cnVlO1xuZ2x0ZlNoYXBlLmlzUG9pbnRlckJsb2NrZXIgPSB0cnVlO1xuZ2x0ZlNoYXBlLnZpc2libGUgPSB0cnVlO1xuZW50aXR5LmFkZENvbXBvbmVudE9yUmVwbGFjZShnbHRmU2hhcGUpO1xuY29uc3QgdHJhbnNmb3JtMiA9IG5ldyBUcmFuc2Zvcm0oe1xuICBwb3NpdGlvbjogbmV3IFZlY3RvcjMoOCwgMCwgOCksXG4gIHJvdGF0aW9uOiBuZXcgUXVhdGVybmlvbigwLCAwLCAwLCAxKSxcbiAgc2NhbGU6IG5ldyBWZWN0b3IzKDEsIDEsIDEpXG59KTtcbmVudGl0eS5hZGRDb21wb25lbnRPclJlcGxhY2UodHJhbnNmb3JtMik7XG5cbmNvbnN0IGltYWdlQmlsbGJvYXJkQmxhY2sgPSBuZXcgRW50aXR5KFwiaW1hZ2VCaWxsYm9hcmRCbGFja1wiKTtcbmVuZ2luZS5hZGRFbnRpdHkoaW1hZ2VCaWxsYm9hcmRCbGFjayk7XG5pbWFnZUJpbGxib2FyZEJsYWNrLnNldFBhcmVudChfc2NlbmUpO1xuY29uc3QgdHJhbnNmb3JtMyA9IG5ldyBUcmFuc2Zvcm0oe1xuICBwb3NpdGlvbjogbmV3IFZlY3RvcjMoOCwgMCwgOCksXG4gIHJvdGF0aW9uOiBuZXcgUXVhdGVybmlvbigwLCAwLCAwLCAxKSxcbiAgc2NhbGU6IG5ldyBWZWN0b3IzKDEsIDEsIDEpXG59KTtcbmltYWdlQmlsbGJvYXJkQmxhY2suYWRkQ29tcG9uZW50T3JSZXBsYWNlKHRyYW5zZm9ybTMpO1xuXG5jb25zdCBjaGFubmVsSWQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDE2KS5zbGljZSgyKTtcbmNvbnN0IGNoYW5uZWxCdXMgPSBuZXcgTWVzc2FnZUJ1cygpO1xuY29uc3QgaW52ZW50b3J5ID0gY3JlYXRlSW52ZW50b3J5KFVJQ2FudmFzLCBVSUNvbnRhaW5lclN0YWNrLCBVSUltYWdlKTtcbmNvbnN0IG9wdGlvbnMgPSB7IGludmVudG9yeSB9O1xuXG5jb25zdCBzY3JpcHQxID0gbmV3IFNjcmlwdDEoKTtcbi8vIEB0cy1pZ25vcmVcbnNjcmlwdDEuaW5pdChvcHRpb25zKTtcbnNjcmlwdDEuc3Bhd24oXG4gIGltYWdlQmlsbGJvYXJkQmxhY2ssXG4gIHtcbiAgICBpbWFnZTpcbiAgICAgIFwiaHR0cHM6Ly9pcGZzLmluZnVyYS5pby9pcGZzL1FtU2dVdlVpcGl5OVRuSjluV2dERGNUeFhwVXhwQzNoQUFkR1lDem41dVJqaXFcIlxuICB9LFxuICBjcmVhdGVDaGFubmVsKGNoYW5uZWxJZCwgaW1hZ2VCaWxsYm9hcmRCbGFjaywgY2hhbm5lbEJ1cylcbik7XG4iXX0=