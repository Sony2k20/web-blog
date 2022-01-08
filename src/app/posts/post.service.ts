import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, deleteDoc, updateDoc, where, query, getDocs, orderBy, setDoc, Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Post } from './post';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class PostService {


  constructor(private firestore: Firestore, private storage: AngularFireStorage) { }

  getPosts(): Observable<Post[]> {
    const postCollection = collection(this.firestore, 'posts');
    const queryType = query(postCollection, orderBy("published", "desc"));
    return collectionData(queryType, { idField: 'id' }) as Observable<Post[]>;
  }

  async countPostsbyType(fieldName: string, value: string) {
    const postCollection = collection(this.firestore, 'posts');
    const queryType = query(postCollection, where(fieldName, "==", value));
    const querySnapshot = await getDocs(queryType);
    const count = querySnapshot.size;
    return count
  }


  async setPost(post: Post, id: string) {
    //setdoc() not working with reference
    const postCollection = collection(this.firestore, 'posts');
    const postRef = doc(postCollection, id);
    await setDoc(postRef, post, { merge: true });
    // await setDoc(postRef, {'published': Timestamp.now()}, { merge: true });
  }


  getPostsCount(): Observable<Post[]> {
    const postCollection = collection(this.firestore, 'posts');
    const queryType = query(postCollection, orderBy("published"));
    return collectionData(queryType, { idField: 'id' }) as Observable<Post[]>;
  }

  getPostData(id: string): Observable<Post> {
    const postData = doc(this.firestore, `posts/${id}`);
    return docData(postData, { idField: 'id' }) as Observable<Post>;
  }

  deleteNote(id: string) {
    console.log('test post service')
    const postRef = doc(this.firestore, `posts/${id}`);
    return deleteDoc(postRef);
  }


}
