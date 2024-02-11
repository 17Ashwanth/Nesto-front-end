import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  server_url='http://localhost:3000'

  wishlistCount = new BehaviorSubject(0)
  cartCount = new BehaviorSubject(0)


  constructor(private http:HttpClient) { 
    if(sessionStorage.getItem('token'))
    {
      this.getwishlistCount()
      this.getCartCount()
    }
  }

  getAllProductAPI(){
    return this.http.get(`${this.server_url}/all-products`)
  }

  registerAPI(user:any){
    return this.http.post(`${this.server_url}/register`,user)

  }

  loginAPI(user:any){
    return this.http.post(`${this.server_url}/login`,user)
 
  }

  getAProductApi(id:any){

    return this.http.get(`${this.server_url}/get-product/${id}`)
  }

  addTokenToHeader(){
    // create an object to the class httpHeaders 
    let headers  = new HttpHeaders()
    const token = sessionStorage.getItem("token")
    if(token)
    {
      /* appending token to the headers */
      headers = headers.append('Authorization',`Bearer ${token}`)
    } 
    return {headers}

  }

  addToWishlistApi(product:any){
    return this.http.post(`${this.server_url}/add-wishlist`,product,this.addTokenToHeader())
   }

   getWishlistItemAPI(){
   return this.http.get(`${this.server_url}/wishlist/allproduct`,this.addTokenToHeader())
   }

getwishlistCount(){
  this.getWishlistItemAPI().subscribe((res:any)=>{
    this.wishlistCount.next(res.length)
  })
}

   removeItemFromWishlist(id:any){
    return this.http.delete(`${this.server_url}/wishlist/removeItem/${id}`,this.addTokenToHeader())
   }

   addToCartAPI(product:any){
    return this.http.post(`${this.server_url}/add-cart`,product,this.addTokenToHeader())
   }

   getCartAPI(){
    return this.http.get(`${this.server_url}/cart/all-product`,this.addTokenToHeader())
   }

   getCartCount(){
    this.getCartAPI().subscribe((res:any)=>{
      this.cartCount.next(res.length)
    })
  }

  removeCartItemAPI(id:any){
    return this.http.delete(`${this.server_url}/cart/remove-item/${id}`,this.addTokenToHeader())
  }

  incrementCartItem(id:any){
    return this.http.get(`${this.server_url}/cart/increment/${id}`,this.addTokenToHeader())
  }

  decrementCartItem(id:any){
    return this.http.get(`${this.server_url}/cart/decrement/${id}`,this.addTokenToHeader())
  }

  EmptyAllCartItemAPI(){
    return this.http.delete(`${this.server_url}/empty/all-cart`,this.addTokenToHeader())
  }
}
