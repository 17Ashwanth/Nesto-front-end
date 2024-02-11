import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
allproducts:any=[]

  constructor(private api:ApiService){}
  ngOnInit(): void {
    this.getWishListItem()
  }

  getWishListItem(){
    this.api.getWishlistItemAPI().subscribe({
      next:(res:any)=>{
        this.allproducts=res
        console.log(this.allproducts);
        
        
      },
      error:(err:any)=>{
        console.log(err);
        
      }
    })
  }

 
  removeItem(id:any){
    this.api.removeItemFromWishlist(id).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.getWishListItem()
        this.api.getwishlistCount()

      },
      error:(err:any)=>{
        console.log(err);
        
      }
    })
  }

  addToCart(product:any){
    if(sessionStorage.getItem("token"))
    {
      Object.assign(product,{quantity:1})
      this.api.addToCartAPI(product).subscribe({
        next:(res:any)=>{
          this.api.getCartCount()
          Swal.fire({
            title: "Added Success",
            text: "Product Added to The Cart Succesfully!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });   
          this.removeItem(product._id)
        },
        error:(err:any)=>{
          console.log(err.error);
          
        }
      })
    }
    else{
      Swal.fire({
        title: "Oops! Something Went Wrong!",
        text: "Please Login to Continue",
        icon: "error",
        showConfirmButton: false,
        timer: 1500
      });
    }

  }
}
