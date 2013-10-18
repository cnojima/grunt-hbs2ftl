<#global pageHead>
<nav class="navbar navbar-fixed-top navbar-checkout">
  <div class="container">
    <a href="#basket" class="navbar-right basket-trigger" data-toggle="tab"><span class="icon icon-basket"><span class="badge">${basket.itemCount!""}</span></span></a>
    <div class="navbar-header">
      <a class="navbar-title" href="/"><img src="/img/logo.svg" width="130" height="17" alt="Sephora"></a>
    </div>
  </div>
</nav>
</#global>
<#global pageFoot>
<div class="navbar navbar-fixed-bottom place-order">
  <div class="container">
    <button type="submit" class="btn btn-block btn-primary navbar-btn place-order-button" <#if paymentComplete == false>disabled</#if>>Place Order</button>
  </div>
</div>
</#global>
<#global afterMain>
  <#include "/basket/basket.ftl" />
</#global>
<#global pageScripts>
  <script>
    SM.env.page = 'checkout';
  </script>
</#global>
<@layout.noHead>



<div class="checkout-main">
  
  <#if bi.biRewards.length??>
  <div class="list-group-item has-child" id="beauty_insider">
    <div class="row">
      <div class="col-xs-4">
        <h5>Beauty Insider</h5>
      </div>
      <div class="col-xs-8">
        <p class="text-muted">${bi.biRewards.length!""} Available</p>
      </div>
    </div>
    <i class="arrow arrow-right"></i>
  </div>
  </#if>
  
  <div class="list-group-item has-child" id="ship_to">
    <div class="row">
      <div class="col-xs-4">
        <h5>Ship to</h5>
      </div>
      <div class="col-xs-8">
        <p>
          <strong class="text-cap">${shippingAddress.firstName!""} ${shippingAddress.lastName!""}</strong><br>
          ${shippingAddress.address1!""}, ${shippingAddress.address2!""}<br>
          ${shippingAddress.city!""}, ${shippingAddress.state!""} ${shippingAddress.postalCode!""}
        </p>
      </div>
    </div>
    <i class="arrow arrow-right"></i>
  </div>
  
  <div class="list-group-item has-child" id="delivery">
    <div class="row">
      <div class="col-xs-4">
        <h5>Delivery</h5>
      </div>
      <div class="col-xs-8">
        <p>${shippingMethod.shippingMethodType!""}</p>
      </div>
    </div>
    <i class="arrow arrow-right"></i>
  </div>
  
  <div class="list-group-item has-child" id="payment">
    <div class="row">
      <div class="col-xs-4">
        <h5>Payment</h5>
      </div>
      <div class="col-xs-8">
        <#list payment as this>
          <p>{${this.formatCC paymentGroupType cardType cardNumber!""}}</p>
        </#list>
        <#if payment.length < 1>
        <p>Add</p>
        </#if>
      </div>
    </div>
    <i class="arrow arrow-right"></i>
  </div>
  
  <div class="list-group-item has-child" id="promotion">
    <div class="row">
      <div class="col-xs-4">
        <h5>Promo</h5>
      </div>
      <div class="col-xs-8">
        <#if promotionsApplied??>
        <#list promotions as this>
        <p>${this.displayName!""}</p>
        </#list>

        <#else>
        <p class="text-muted">Optional</p>
        </#if>
      </div>
    </div>
    <i class="arrow arrow-right"></i>
  </div>
      
  <ul class="list-group order-totals">
    <li class="list-group-item">Merchandise Total <span class="pull-right">${orderDetails.priceInfo.merchandiseSubtotal!""}</span></li>
    <li class="list-group-item">Merchandise Shipping <span class="pull-right">${orderDetails.priceInfo.merchandiseShipping!""}</span></li>
    <li class="list-group-item">Tax <span class="pull-right">${orderDetails.priceInfo.tax!""}</span></li>
    <li class="list-group-item order-total"><b>Order Total <span class="pull-right">${orderDetails.priceInfo.orderTotal!""}</span></b></li>
  </ul>
    
</div><!-- .checkout-main -->
  





</@layout.noHead>