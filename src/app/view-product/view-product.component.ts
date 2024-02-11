import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {
  product:any={}

  constructor(private api:ApiService, private route:ActivatedRoute){}
  ngOnInit(): void {
    this.route.params.subscribe((res:any)=>{
      const id = res.id
      console.log(id);

      this.getProduct(id)
      
    })
    
  }

  getProduct(id:any){
    this.api.getAProductApi(id).subscribe({
      next:(res:any)=>{
        this.product=res[0]
        console.log(this.product);     
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
        this.api.getwishlistCount()
        Swal.fire({
          title: "Added Success",
          text: "Product Added to Wishlist successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        });      
      },
      error:(err:any)=>{
        console.log(err);
        
        Swal.fire({
          title: "Oops!",
          text: "Item is Alerdy In The Wishlist",
          icon: "info",
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
      });    }

  }

}

