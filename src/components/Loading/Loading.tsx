import { FC } from "react";

export const Loading: FC = () => {
  return (
    <div>
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
