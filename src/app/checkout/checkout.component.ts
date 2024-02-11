import { Component } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  constructor(private fb:FormBuilder, private api:ApiService, private router:Router){}

  ProceedToPaystatus:boolean=false
  MakePayementStatus:boolean=false
  GrandTotal:any=""
  public payPalConfig?: IPayPalConfig;

   checkoutForm= this.fb.group({
    userName:['',[Validators.required,Validators.pattern('[a-zA-Z ]*')]],
    flat:['',[Validators.required,Validators.pattern('[a-zA-Z0-9 :,.]*')]],
    city:['',[Validators.required,Validators.pattern('[a-zA-Z ]*')]],
    pincode:['',[Validators.required,Validators.pattern('[0-9]*')]],
   })

   cancel(){
    this.checkoutForm.reset()
   }

   proceedToPay(){
    if(this.checkoutForm.valid){
      this.ProceedToPaystatus=true
      this.GrandTotal=sessionStorage.getItem("total")

    }
    else
    {
      Swal.fire({
        position:"top",
        title:"Form Invalid!",
        icon:"warning",
        showConfirmButton: false,
        timer: 1500
      })
    }
   }

   back(){
    this.ProceedToPaystatus = false
   }

   makePayment(){
    this.MakePayementStatus = true
    this.initConfig()
   }

   private initConfig(): void {
    this.payPalConfig = {
    currency: 'USD',
    clientId: 'sb',
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: this.GrandTotal,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: this.GrandTotal
              }
            }
          },
          
        }
      ]
    },
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'vertical'
    },
    onApprove: (data, actions) => {
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then((details:any) => {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    //invoke when payment is succesfull
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      
      this.api.EmptyAllCartItemAPI().subscribe((res:any)=>{
        this.api.getCartCount()
      Swal.fire({
        position:"top",
        title:"Payment SuccessFully Done!",
        icon:'success',
        showConfirmButton: false,
        timer: 1500
      })
      this.ProceedToPaystatus=false
      this.MakePayementStatus=false
      this.router.navigateByUrl("/")
      })
     
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
      Swal.fire({
        position:"top",
        title:"Payment Cancelled!",
        icon:'info',
        showConfirmButton: false,
        timer: 1500
      })
      this.ProceedToPaystatus=true

    },
    onError: err => {
      console.log('OnError', err);
      Swal.fire({
        position:"top",
        title:"Transaction Failed! Please Try again after Sometime!",
        icon:'error',
        showConfirmButton: false,
        timer: 1500
      })
      this.ProceedToPaystatus=true
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    },
  };
  }
   
}
