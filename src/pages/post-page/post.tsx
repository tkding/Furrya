import React, { useContext, useEffect, useState } from "react";

import { AppContext, Post as IPost } from "../../App";

import {
  addDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface PostProps {
  post: IPost;
}

interface Likes {
  userId: string;
  id: String;
}

export const Post = (props: PostProps) => {
  const { post } = props;
  const [user] = useAuthState(auth);
  // const [ likes, setLikes ] = useState<Likes[] | null>(null);
  const { likes, setLikes } = useContext(AppContext);

  const likesRef = collection(db, "likes");
  // const likesDoc = query(likesRef, where("postId", "==", post.id));
  // const getLikes = async () => {
  //     const data = await getDocs(likesDoc);
  //     setLikes(data.docs.map(doc => ({userId: doc.data().userId, id: doc.id})) as Likes[] );
  // }
  let hasLiked =
    likes &&
    likes.some((like) => like.userId === user?.uid && like.postId === post.id);

  const addLike = async () => {
    try {
      console.log("addLike");
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        postId: post.id,
      });
      hasLiked = true;
      // if( user ){
      //     setLikes((prev) =>
      //         prev ? [...prev, {userId: user.uid, postId: post.id, id: newDoc.id}] : [{userId: user.uid, postId: post.id, id: newDoc.id}]
      //     );

      // }
    } catch (err) {
      console.log(err);
    }
  };

  const removeLike = async () => {
    try {
      console.log("removeLike");
      const likeToDeleteQuery = query(
        likesRef,
        where("userId", "==", user?.uid),
        where("postId", "==", post.id)
      );
      const likeToDeleteData = await getDocs(likeToDeleteQuery);
      const likeId = likeToDeleteData.docs[0].id;
      const likeToDelete = doc(db, "likes", likeId);
      await deleteDoc(likeToDelete);
      hasLiked = false;
      // if( user ){
      //     setLikes((prev) =>
      //         prev ? prev.filter((like) => like.id !== likeId) : []
      //     );

      // }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // getLikes();
  }, []);

  return (
    // <div class="card" style="width: 18rem;">
    // <div class="card-body">
    //     <h5 class="card-title">Card title</h5>
    //     <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
    //     <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    //     <a href="#" class="card-link">Card link</a>
    //     <a href="#" class="card-link">Another link</a>
    // </div>
    // </div>
    <div className="card card-post">
      <div className="card-body">
        <div className="card-title title">
          <h3>{post.title}</h3>
        </div>
        <div className="card-text description">
          <p>{post.description}</p>
        </div>
        <div className="card-subtitle username">
          <p>@{post.username}</p>
        </div>
        <div className="likes">
          {hasLiked ? (
            <button className="btn-unlike" onClick={removeLike}>
              {" "}
              👎unlike{" "}
            </button>
          ) : (
            <button className="btn-like" onClick={addLike}>
              {" "}
              👍like{" "}
            </button>
          )}

          {likes && (
            <p>
              {" "}
              Likes: {
                likes.filter((like) => like.postId === post.id).length
              }{" "}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// <div key={post.id}>
//     <h3>{post.title}</h3>
//     <p>{post.description}</p>
//     <p>{post.username}</p>
// </div>)
