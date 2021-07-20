import { createChannel } from '../node_modules/decentraland-builder-scripts/channel';
import { createInventory } from '../node_modules/decentraland-builder-scripts/inventory';
import Script1 from "../c4a799c1-9ef8-4787-914e-4f8c15357881/src/item";

const _scene = new Entity('_scene');
engine.addEntity(_scene);
const transform = new Transform({
  position: new Vector3(0, 0, 0),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
});
_scene.addComponentOrReplace(transform);

const entity = new Entity('entity');
engine.addEntity(entity);
entity.setParent(_scene);
const gltfShape = new GLTFShape("models/FloorBaseGrass_01/FloorBaseGrass_01.glb");
gltfShape.withCollisions = true;
gltfShape.isPointerBlocker = true;
gltfShape.visible = true;
entity.addComponentOrReplace(gltfShape);
const transform2 = new Transform({
  position: new Vector3(8, 0, 8),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
});
entity.addComponentOrReplace(transform2);

const entity2 = new Entity('entity2');
engine.addEntity(entity2);
entity2.setParent(_scene);
entity2.addComponentOrReplace(gltfShape);
const transform3 = new Transform({
  position: new Vector3(24, 0, 8),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
});
entity2.addComponentOrReplace(transform3);

const entity3 = new Entity('entity3');
engine.addEntity(entity3);
entity3.setParent(_scene);
entity3.addComponentOrReplace(gltfShape);
const transform4 = new Transform({
  position: new Vector3(8, 0, 24),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
});
entity3.addComponentOrReplace(transform4);

const entity4 = new Entity('entity4');
engine.addEntity(entity4);
entity4.setParent(_scene);
entity4.addComponentOrReplace(gltfShape);
const transform5 = new Transform({
  position: new Vector3(24, 0, 24),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
});
entity4.addComponentOrReplace(transform5);

const imageBillboardBlack = new Entity('imageBillboardBlack');
engine.addEntity(imageBillboardBlack);
imageBillboardBlack.setParent(_scene);
const transform6 = new Transform({
  position: new Vector3(17.5, 0, 9.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
});
imageBillboardBlack.addComponentOrReplace(transform6);

const channelId = Math.random().toString(16).slice(2);
const channelBus = new MessageBus();
const inventory = createInventory(UICanvas, UIContainerStack, UIImage);
const options = { inventory };

const script1 = new Script1();
script1.init(options);
script1.spawn(imageBillboardBlack, { "image": "https://ipfs.infura.io/ipfs/QmX4y951G7MiV69yuGCnFC7o7RCriQbP9uCHTbRjFwohTT" }, createChannel(channelId, imageBillboardBlack, channelBus));