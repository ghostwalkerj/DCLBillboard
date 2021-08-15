import React, { ReactElement, useContext, useEffect, useState } from "react";
import {
  CurrentAddressContext,
  DCLBillboardContext,
} from "../hardhat/SymfoniContext";

type Props = {
  roles: Role[];
};

enum Role {
  Admin,
}

const RoleContext = React.createContext<Partial<Props>>({});

function RoleProvider(props: { children: JSX.Element }): ReactElement {
  const dclbillboardCtx = useContext(DCLBillboardContext);
  const [roles, setRoles] = useState<Role[]>([]);

  const [address, setAddress] = useContext(CurrentAddressContext);

  window.ethereum.on("accountsChanged", (accounts: any) => {
    setAddress(accounts[0]);
  });

  useEffect(() => {
    const initializeRoles = async () => {
      const _roles: Role[] = [];
      try {
        if (dclbillboardCtx.instance) {
          const _isAdmin = await dclbillboardCtx.instance.isAdmin();
          console.log("Admin: ", _isAdmin);
          if (_isAdmin) {
            _roles.push(Role.Admin);
          }
        }
      } catch (e) {
      } finally {
        setRoles(_roles);
      }
    };
    initializeRoles();
  }, [dclbillboardCtx.instance, address]);

  return (
    <RoleContext.Provider value={{ roles }}>
      {props.children}
    </RoleContext.Provider>
  );
}

export { Role, RoleContext, RoleProvider };
