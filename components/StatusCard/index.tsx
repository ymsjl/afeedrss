import React from "react";
import Image from "next/image";
import { makeStyles } from "@fluentui/react-components";

interface Props {
  content?: React.ReactNode;
  status: Status;
}

export enum Status {
  EMPTY = 0,
  ERROR = 1,
}

const StatusImageMap = {
  [Status.EMPTY]: "/images/hole_3d.png",
  [Status.ERROR]: "/images/3d-fluency-bandage.png",
};

const useStyles = makeStyles({
  container: {
    paddingTop: "5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  content: {
    fontSize: "0.875rem",
    color: "#6b7280",
    marginTop: "1.5rem",
  }
});

export default function StatusCard({ content, status }: Props) {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Image
        src={StatusImageMap[status]}
        width={120}
        height={120}
        alt=""
        style={{ objectFit: 'contain'}}
      />
      <div className={classes.content}>{content}</div>
    </div>
  );
}
