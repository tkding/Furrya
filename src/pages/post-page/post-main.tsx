import React from 'react';

import { useState, useEffect, useContext } from 'react';

import { getDocs, collection, query, orderBy, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from "../../config/firebase";

import { Post } from './post';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Auth } from '../../components/Auth';

import { Post as IPost, Likes as ILikes, AppContext } from '../../App'
 
// pagination
import ReactPaginate from 'react-paginate';
import { get } from 'http';
import { unsubscribe } from 'diagnostics_channel';

interface Pagination{
    data: IPost[] | null;
    offset: number;
    numberPerPage: number;
    pageCount: number;
    currentData: IPost[] | null;
}

export const PostMain = () => {
    const [ user ] = useAuthState(auth);

    const postsRef = collection(db, "posts");
    const { postsList, setPostsList } = useContext(AppContext);

    const [pagination, setPagination] = useState<Pagination>({
        data: postsList,
        offset: 0,
        numberPerPage: 10,
        pageCount: 0,
        currentData: []
    });

    const getPosts = async () => {
        try{
            const queryPosts = query(postsRef, orderBy("createAt", "desc"));
            const unsubscribe = onSnapshot(queryPosts, (snapshot) => {
                let posts: IPost[] = [];
                snapshot.forEach((doc) => {
                    posts.push({ id: doc.id, ...doc.data() } as IPost);
                });
                setPostsList(posts);
                return () => unsubscribe;
            });
            // const data = await getDocs(query(postsRef, orderBy("createAt", "desc")));
            // setPostsList(data.docs.map(doc => ({...doc.data(), id: doc.id})) as IPost[] );
        }
        catch(error){
            console.log(error);
        }
    }

    const { likes, setLikes } = useContext(AppContext);
    const likesRef = collection(db, "likes");
    // const likesDoc = query(likesRef);
    const getLikes = async () => {
        const queryLikes = query(likesRef);
        const unsubscribe = onSnapshot(queryLikes, (snapshot) => {
            let likes: ILikes[] = [];
            snapshot.forEach((doc) => {
                likes.push({userId: doc.data().userId, postId: doc.data().postId, id: doc.id} as ILikes);
            });
            setLikes(likes);
            return () => unsubscribe;
        });

        // const data = await getDocs(likesDoc);
        // setLikes(data.docs.map(doc => ({userId: doc.data().userId, postId: doc.data().postId, id: doc.id})) as ILikes[] );
    }

    const [ disabled, setDisabled ] = useState(false);

    useEffect (() => {
        try{
            // user && getPosts() and getLikes() are called here to prevent infinite loop
            console.log("called useEffect in PostMain");
            user && getPosts();
            user && getLikes();     // TODO how to unscubscribe?

            // Call setPagination here, after updating postsList
            setPagination(prevState => ({
                ...prevState,
                currentData: postsList?.slice(prevState.offset, prevState.offset + prevState.numberPerPage) as IPost[],
                pageCount: Math.ceil((postsList ? postsList.length : 1) / prevState.numberPerPage),
            }));
        } catch (error) {
            console.log(error);
        }
    }, [pagination.numberPerPage, pagination.offset, user, disabled]);

    const handlePageClick = (event: any) => {
        const selected = event.selected;
        const offset = selected * pagination.numberPerPage;
        setPagination({...pagination, offset: offset});
    }

    const handleRefresh = () => {
        setDisabled(true);
    }

    if ( !user ){
        return (
            <div className="App">
                <h2> Please Log in to continue.</h2>
                <Auth />
            </div>
        );
    };

    return (
        <div>
            <h1>Posts</h1>

            {pagination.currentData ? pagination.currentData.map(post => (
                <Post key={post.id} post={post}/>
                )
            ) : (
                <>
                    <h2> No Post</h2>
                    <button
                        type="submit"
                        onClick={handleRefresh}
                        disabled={disabled}
                    >
                        <h3 className='refresh-btn'>Refresh</h3>
                    </button>
                </>
            )}

            <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={"..."}
                pageCount={pagination.pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                activeClassName={"active"}
            />

            {/* {postsList?.map(post => (
                <Post key={post.id} post={post}/>
                )
            )} */}
        </div>
    );
}
