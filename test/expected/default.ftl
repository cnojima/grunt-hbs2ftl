<#macro default>
<#include "/common/head.ftl" />

<section class="page ${pageClass!""} active fade in" id="main">
  ${pageHead!""}
  <#include "/common/navbarPrimary.ftl" />
  <div class="content">
    ${contentHead!""}
    <div class="main-content container">
      <#nested>
    </div>
    ${contentFoot!""}
  </div>
  ${pageFoot!""}
</section>

<#--  basket is fully UI-side basket/basket -->

<#include "/common/foot.ftl" />
</#macro>