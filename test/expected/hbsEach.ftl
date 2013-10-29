<!--
<#--  test handlebars #each foo -> &lt;#list foo as this&gt; -->
-->

<div class="foo">
  <p>
    <#--  "this" is implied in hbs -->
    <#list myVar as i_myVar>
      ${i_myVar.foo!""} is ${i_myVar.bar!""}
    </#list>
  </p>

  lotsa stuff here....

  <p class="bar">
    <#list myNamespace.listThing as i_myNamespace_listThing>
      ${i_myNamespace_listThing.yetAnotherFoo!""} should be ${i_myNamespace_listThing.yetAnotherBar!""}
    </#list>
  </p>
</div>