<!--
<#--  test handlebars #each foo -> &lt;#list foo as this&gt; -->
-->

<div class="foo">
  <p>
    <#--  "this" is implied in hbs -->
    <#list myVar as this>
      ${this.foo!""} is ${this.bar!""}
    </#list>
  </p>

  lotsa stuff here....

  <p class="bar">
    <#list myNamespace.listThing as this>
      ${this.yetAnotherFoo!""} should be ${this.yetAnotherBar!""}
    </#list>
  </p>
</div>