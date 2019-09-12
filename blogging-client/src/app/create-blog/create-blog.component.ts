import { MapsAPILoader } from '@agm/core';
import { UserService } from './../services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, NgZone } from '@angular/core';
import * as io from 'socket.io-client';
const parse = require('parse-mentions');

@Component({
    selector: 'app-create-blog',
    templateUrl: './create-blog.component.html',
    styleUrls: ['./create-blog.component.css']
})
export class CreateBLogComponent implements OnInit {
    private SOCKET = io('http://127.0.0.1:3000');
    // private SOCKET = io ('https://backend-blogging-appliaction.herokuapp.com');
    public submitted: boolean;
    private mentionedUsers: Array<string>;
    private filesToUpload: Array<File> = [];
    public currentUserId: string;
    public currentUserName: string;
    public incorrectPost: boolean;
    public item: any;
    public uploadBlogImages: boolean;
    private geoCoder;
    public zoom: number;
    public latitude: number;
    public longitude: number;
    public address: string;
    public showGoogleMap: boolean;
    public searchInfo: any;
    public blogUploadSuccess: boolean;

    postForm: FormGroup = new FormGroup({
        title: new FormControl(null, Validators.required),
        description: new FormControl(null, Validators.required),
        image: new FormControl(null)
    });

    constructor(private userService: UserService, private mapsAPILoader: MapsAPILoader) { }

    ngOnInit() {
        this.currentUserId = localStorage.getItem('userId');
        this.currentUserName = localStorage.getItem('user');
        this.tagUser();

        // this.mapsAPILoader.load().then(() => {
            // this.setCurrentLocation();
            // this.geoCoder = new (google.maps.Geocoder)();
            // let autocomplete = new google.maps.places.Autocomplete(this.search, {
            //     types: ["address"]
            //   });
            //   autocomplete.addListener("place_changed", () => {
            //     this.ngZone.run(() => {
            //       let place: google.maps.places.PlaceResult = autocomplete.getPlace();
            //       if (place.geometry === undefined || place.geometry === null) {
            //         return;
            //       }
            //       this.latitude = place.geometry.location.lat();
            //       this.longitude = place.geometry.location.lng();
            //       this.zoom = 12;
            //     });
            // });
        // });

        this.searchInfo = {
            location: '',
        };
    }

    private setCurrentLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.zoom = 8;
                this.getAddress(this.latitude, this.longitude);
            });
        }
    }

    markerDragEnd($event: MouseEvent) {
        // this.latitude = $event.coords.lat;
        // this.longitude = $event.coords.lng;
        this.getAddress(this.latitude, this.longitude);
    }
    searchLoc(temp) {
        this.geoCoder.geocode({ address: temp.location }, (results, status) => {
            // console.log(status);
            // if (status === 'OK') {
            //     if (results[0]) {
            //     this.zoom = 12;
            //     this.address = results[0].formatted_address;
            //     } else {
            //     window.alert('No results found');
            //     }
            // } else {
            //     window.alert('Geocoder failed due to: ' + status);
            // }

        });

    }
    getAddress(latitude, longitude) {

        this.geoCoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            // console.log(results);
            // console.log(status);
            if (status === 'OK') {
                if (results[0]) {
                    this.zoom = 12;
                    this.address = results[0].formatted_address;
                } else {
                    window.alert('No results found');
                }
            } else {
                // window.alert('Geocoder failed due to: ' + status);
            }

        });

    }

    get f() { return this.postForm.controls; }


    tagUser() {
        this.userService.tagUser().subscribe(
            (data: any) => {
                this.item = data.userName;
            },
            err => console.log(err)
        );
    }

    AddPost() {
        this.submitted = true;
        if (!this.postForm.valid) {
            return;
        }

        const mentions = parse(this.postForm.value.description);
        this.mentionedUsers = mentions.matches.map(item => item.name)
            .filter((value, index, self) => self.indexOf(value) === index);

        const formData: any = new FormData();
        const files: Array<File> = this.filesToUpload;

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const name = 'name';
                formData.append('uploads[]', files[i], files[i][name]);
            }
        }
        const obj = {
            title: this.postForm.value.title,
            description: this.postForm.value.description,
            userId: this.currentUserId,
            userName: this.currentUserName
        };

        formData.append('forminput', JSON.stringify(obj));
        this.userService.addPost(formData).subscribe(
            (data: any) => {
                this.blogUploadSuccess = true;
                this.SOCKET.emit('post', obj);
                this.submitted = false;
                this.postForm.reset();
                const mentioned = {
                    type: 'taggedOnBlog',
                    postId: data._id,
                    users: this.mentionedUsers,
                    name: this.currentUserName,
                    id: this.currentUserId
                };
                this.SOCKET.emit('tag', mentioned);
                this.userService.sendNotification(mentioned).subscribe(
                    data => { },
                    err => {
                        console.log(err);
                    }
                );
            },
            error => {
                this.incorrectPost = true;
                console.error(error);
            }
        );
    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = fileInput.target.files as Array<File>;
    }

    UploadBlogImages() {
        this.uploadBlogImages = !this.uploadBlogImages;
        this.submitted = false;
    }

    FadeOutSuccessMsg() {
        setTimeout(() => {
            this.blogUploadSuccess = false;
        }, 4000);
    }
}
