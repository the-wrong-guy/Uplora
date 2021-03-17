import { db } from "../../../firebase";
export function ReportPost({ user, postId }) {
  if (user) {
    try {
      db.collection("reported_post")
        .doc(postId)
        .collection("reports")
        .doc(user.uid)
        .set({
          userName: user.displayName,
          userId: user.uid,
          postId: postId,
        });
    } catch (error) {
      console.log(error);
    }
  }
}
