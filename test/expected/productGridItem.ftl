<a href="/product/${productId!""}" class="col-xs-6 col-sm-4 col-md-3 grid-item product-item">
  <div class="product-image">
    <img class="lazy product-grid-image" src="/img/common/spinner_250.gif" data-src="${i_products.image135!""}" data-src-retina="${i_products.image250!""}" alt="${i_products.currentSku.imageAltText!""}" title="${i_products.displayName!""}" width="135" height="135">
  </div>
  <div class="product-info">
    <h4 class="product-heading">
      <span class="brand">${i_products.brandName!""}</span><br>
      <span class="name">${i_products.displayName!""}</span><br>
      <span class="price">${i_products.currentSku.listPrice!""}</span>
    </h4>
    <p class="flags">
      <#assign a = i_products.currentSku>
      <#if a.isSephoraExclusive??>
        <span>exclusive</span>
      </#if>
      <#if a.isLimitedEdition??>
        <span>limited edition</span>
      <#else>
        <#if a.isOnlineOnly??>
          <span>online only</span>
        </#if>
      </#if>
      
    </p>
    <p class="product-rating">
      <span class="stars" data-rating="${rating!""}"><span></span></span>
    </p>
  </div>
</a>
