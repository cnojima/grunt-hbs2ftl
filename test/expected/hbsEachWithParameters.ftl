<!--
<#--  test handlebars #each foo -> &lt;#list foo as this&gt; -->
-->

<div class="foo">
  <p>
    <#--  "this" is implied in hbs -->
    <#list (myVar)![] as i_myVar>
      ${(foo!"")?html} is ${(bar!"")?html}
    </#list>
  </p>

  lotsa stuff here....

  <p class="bar">
    <#list (myNamespace.listThing)![] as i_myNamespace_listThing>
      ${(yetAnotherFoo!"")?html} should be ${(yetAnotherBar!"")?html}
    </#list>
  </p>
</div>