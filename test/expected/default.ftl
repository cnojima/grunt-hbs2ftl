<#macro default>
<#include "/common/head.ftl" />

<section class="page ${pageClass!""} active fade in" id="main">
  ${pageHead!""}
  <#include "/common/navbarDefault.ftl" />
  <div class="content ${contentClass!""}">
    ${contentHead!""}
    <div class="main-content">
      <#nested>
    </div>
    ${contentFoot!""}
  </div>
  ${pageFoot!""}
</section>

<#--  basket is fully UI-side basket/basket -->

<#include "/common/foot.ftl" />
</#macro>