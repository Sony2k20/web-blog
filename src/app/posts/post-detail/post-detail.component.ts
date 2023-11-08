import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Aos from 'aos';
import { PostDataService } from 'src/app/post-data.service';
import { Post } from '../post';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.sass'],
})
export class PostDetailComponent implements OnInit {
  data: Post | undefined;
  post: Post | undefined;
  postOrderByTitle: Post[] | undefined;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private postData: PostDataService
  ) {
    this.postData.obersevevalueIfPost(true);
  }

  ngOnInit(): void {
    this.getPost();
    this.postService.getPostsOrderByTitle().subscribe((res) => {
      this.postOrderByTitle = res;
    });
  }

  ngAfterViewChecked() {
    try {
      document.getElementById('site-title')!.style.backgroundImage =
        'url(' + this.post?.image + ')';
    } catch (error) {}
  }

  getPost() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.postService.getPostData(id).subscribe((data) => {
      this.post = data;
      this.postData.obersevePostData(data);
    });
  }

  goToContent() {
    document.getElementById('contentBox')!.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
}
