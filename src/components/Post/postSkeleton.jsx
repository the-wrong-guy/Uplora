import React from "react";
import { Card } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import styles from "./post.module.scss";

export default function PostSkeleton() {
  return (
    <Card className={styles.skelCard}>
      <div
        style={{
          display: "flex",
          gap: "5px",
          padding: "5px",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Skeleton animation='wave' variant='circle' width={40} height={40} />
        <Skeleton animation='wave' height={15} width='30%' />
      </div>
      <Skeleton style={{ height: "300px" }} animation='wave' variant='rect' />
      <div style={{ padding: "7px" }}>
        <Skeleton animation='wave' height={10} style={{ marginBottom: 6 }} />
        <Skeleton animation='wave' height={10} width='80%' />
      </div>
    </Card>
  );
}
