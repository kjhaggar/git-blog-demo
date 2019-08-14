import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-public-profile',
    templateUrl: './public-profile.component.html',
    styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {
    public id: string;
    public sub: any;
    public getCurrentUserId: string;
    public getCurrentUserName: string;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            const postId = 'id';
            this.id = params[postId];
        });
        this.getCurrentUserId = localStorage.getItem('userId');
        this.getCurrentUserName = localStorage.getItem('user');
    }

}
