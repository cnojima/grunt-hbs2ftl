<!--
<#--  test handlebars #each foo -> &lt;#list foo as this&gt; -->
-->

<div class="foo">
  <p>
    <#--  "this" is implied in hbs -->
    <#list myVar as i_myVar>
      ${i_myVar.foo!""} is ${i_myVar.bar!""}
    </@helper.each>
  </p>

  lotsa stuff here....

  <p class="bar">
    <#list i_myVar.myNamespace.listThing as i_myNamespace.listThing></#list>
  </p>

  lotsa stuff here....

  <p class="bar">
    <@helper.each myNamespace.listThing>
      ${i_myVar.yetAnotherFoo!""} should be ${i_myVar.yetAnotherBar!""}
    </#list>
  </p>
</div>