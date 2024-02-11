import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-all-product',
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.css']
})
export class AllProductComponent implements OnInit {

  allproduct:any=[]

  constructor(private api:ApiService){}

  ngOnInit(): void {
    this.api.getAllProductAPI().subscribe({
      next:(res:any)=>{
        this.allproduct=res
        console.log(this.allproduct);
        
      },
      error:(err:any)=>{
        console.log(err);
        
      }
    })
    
    
  }

  addToWishlist(product:any){
    if(sessionStorage.getItem("token"))
    {
     this.api.addToWishlistApi(product).subscribe({
      next:(res:any)=>{
        console.log(res);
       Swal.fire({
        title: "Added Success",
        text: "Product Added to Wishlist successfully",
        icon: "success",
        showConfirmButton: false,
        timer: 1500
      });
       this.api.getwishlistCount()
      },
      error:(err:any)=>{
        console.log(err);
        Swal.fire({
          title: "Oops! Something Went Wrong!",
          text: err.error,
          icon: "error",
          showConfirmButton: false,
          timer: 1500
        });
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

  
  addToCart(product:any){
    if(sessionStorage.getItem("token"))
    {
      Object.assign(product,{quantity:1})
      this.api.addToCartAPI(product).subscribe({
        next:(res:any)=>{
          Swal.fire({
            title: "Added Success",
            text: "Product Added to The Cart Succesfully!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.api.getCartCount()

        },
        error:(err:any)=>{
          console.log(err.error);
          Swal.fire({
            title: "Oops! Something Went Wrong!",
            text: err.error,
            icon: "error",
            showConfirmButton: false,
            timer: 1500
          });
          
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
