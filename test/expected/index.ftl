<#global pageClass>page-home</#global>

<#global pageHead>
  <img src="/img/bg/bg-home.jpg" class="bg">
</#global>
<#global contentHead>
  <#include "/common/catNav.ftl" />
</#global>
<#global pageScripts>
<script>
  var slider =
  Swipe(document.getElementById('trend-swipe'), {
    continuous: true,
    callback: function(pos) {
      var i = bullets.length;
      while (i--) {
        bullets[i].className = ' ';
      }
      bullets[pos].className = 'active';
    }
  });
  var bullets = document.getElementById('trend-swipe-position').getElementsByTagName('li');
</script>
</#global>
<@layout.default>

 




<div class="home-search">
  <input name="global_search" id="global_search" type="search" placeholder="Search" autocomplete="off" class="form-control input-sm">
  <span class="icon icon-search"></span>
</div>
  
<ul class="home-links list-unstyled clearfix">
  <li><a href="#">Brands</a></li>
  <li><a href="#">Shop</a></li>
  <li><a href="/account">Account</a></li>
  <li><a href="#">Stores</a></li>
</ul>

<div class="bi-greeting clearfix">
  <img src="/img/card-vib.png" class="pull-left">
  <p class="text-upper">
    <#if userinfo??>
      <#if userinfo.beautyInsiderAccount??>
        ${userinfo.firstName!""} ${userinfo.lastName!""}<br>
        <b>${bi.beautyBankPoints!""} points</b>
      <#else>
        Beauty Insider<br>
        <b><a href="#modal-bi-signup" data-toggle="modal" class="text-underline">Sign up</a></b>
      </#if>
    <#else>
      Welcome!<br>
      <b><a href="#modal-signin" data-toggle="modal" class="text-underline">Sign in</a> <span class="divider">/</span> <a href="#modal-register" data-toggle="modal" class="text-underline">Register</a></b>
    </#if>
  </p>
</div>

<div class="today-links">
  <h3 class="text-center">Today</h3>
  <ul class="list-unstyled">
    <li><a href="#">Today’s Free Sample</a></li>
    <li><a href="#">What’s New</a></li>
    <li><a href="#">Bestsellers</a></li>
    <li><a href="#">Sale</a></li>
    <li><a href="#">Daily Obsession</a></li>
    <li><a href="#">Hot Now</a></li>
    <li><a href="#">The Glossy</a></li>
  </ul>
</div>

<div class="trend-swiper-container">
  <h3 class="text-center">Trending Now</h3>
  <div id="trend-swipe" class="swipe">
    <div class='swipe-wrap'>
      <a href="#" onclick="return false" class="item"><img src="/img/common/spinner_250.gif" data-src="/img/fpo/fpo-trend1.jpg" class="lazy"></a>
      <a href="#" onclick="return false" class="item"><img src="/img/common/spinner_250.gif" data-src="/img/fpo/fpo-trend2.jpg" class="lazy"></a>
      <a href="#" onclick="return false" class="item"><img src="/img/common/spinner_250.gif" data-src="/img/fpo/fpo-trend3.jpg" class="lazy"></a>
    </div>
  </div>
  <ol id="trend-swipe-position" class="swipe-indicators">
    <li class="active"></li>
    <li></li>
    <li></li>
  </ol>
</div>

<#include "/common/footNav.ftl" />


 </@layout.default>