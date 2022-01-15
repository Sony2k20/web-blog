import { Component, OnInit, ViewChild } from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../post';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { SwiperComponent } from "swiper/angular";
import { OwlOptions } from 'ngx-owl-carousel-o';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

// import Swiper core and required modules
import SwiperCore, { Autoplay, Pagination, Navigation, EffectFade, EffectCoverflow } from "swiper";
import { PostDataService } from 'src/app/post-data.service';
import { MatPaginator } from '@angular/material/paginator';

// install Swiper modules
SwiperCore.use([Autoplay, Pagination, Navigation, EffectFade, EffectCoverflow]);

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.sass'],
})
export class PostListComponent implements OnInit {
  
  // @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  searchForm = new FormControl();
  subscribeForm = new FormControl();

  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]> | undefined;
  
  articlesCountDashboard: number = 3;
  posts: Post[] = [];
  allPosts: Post[] = [];
  games: string = 'games';
  movies: string = 'movies';
  series: string = 'series';
  animes: string = 'animes';
  gamesCount: any;
  moviesCount: any;
  seriesCount: any;
  animesCount: any;

  activeColor = "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)rgb(255, 145, 0)";
  notActiveColor = "linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)";

  constructor(
    private postService: PostService, 
    private scroller: ViewportScroller,
     private router: Router,
     private postData: PostDataService,
     ){
    this.postService.getPosts().subscribe(res => {
      this.allPosts = res;
      this.posts = this.allPosts.slice(0, this.articlesCountDashboard )
    });
    this.postData.obersevevalueIfPost(false)
  }

  ngOnInit(): void {

    (async () => {
      this.animesCount = (await this.postService.countPostsbyType("type","animes"))
    })();

    (async () => {
      this.gamesCount = (await this.postService.countPostsbyType("type","games"))
    })();

    (async () => {
      this.seriesCount = (await this.postService.countPostsbyType("type","series"))
    })();

    (async () => {
      this.moviesCount = (await this.postService.countPostsbyType("type","movies"))
    })();

    this.filteredOptions = this.searchForm.valueChanges.pipe(
      startWith(''),
      map(value => this.filterSearch(value)),
    );
  }


  private filterSearch(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }



  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 600,
    navText: ['&#8249', '&#8250;'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      760: {
        items: 3
      },
      1000: {
        items: 4
      }
    },
    nav: true
  }

  goToSlider() {
    document.getElementById("site-content")!.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

  filterGames(id: string) {
    if (this.games === id) {
      document.getElementById(id)!.style.background = this.notActiveColor;
      this.games = "";
    } else {
      document.getElementById(id)!.style.background = this.activeColor;
      this.games = id;
    }
  }

  filterSeries(id: string) {
    if (this.series === id) {
      document.getElementById(id)!.style.background = this.notActiveColor;
      this.series = "";
    } else {
      document.getElementById(id)!.style.background = this.activeColor;
      this.series = id;
    }
  }

  filterMovies(id: string) {
    if (this.movies === id) {
      document.getElementById(id)!.style.background = this.notActiveColor;
      this.movies = "";
    } else {
      document.getElementById(id)!.style.background = this.activeColor;
      this.movies = id;
    }
  }
 
  filterAnimes(id: string) {
    if (this.animes === id) {
      document.getElementById(id)!.style.background = this.notActiveColor;
      this.animes = "";
    } else {
      document.getElementById(id)!.style.background = this.activeColor;
      this.animes = id;
    }
  }

  onPageChange(event: any) {
    this.posts = this.allPosts.slice(event.pageIndex*event.pageSize, event.pageIndex*event.pageSize + event.pageSize);
  }

}



