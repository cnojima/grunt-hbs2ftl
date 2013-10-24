<!--
<#--  test handlebars embedded #each  -->
-->

<div class="foo">
  <p>
    <#--  "this" is implied in hbs -->
    <#list myVar as i_myVar>
      ${i_myVar.foo!""} is ${i_myVar.bar!""}

      <p class="bar">
        <#list i_myVar.listThing as i_listThing>
          ${i_listThing.yetAnotherFoo!""} should be ${i_listThing.yetAnotherBar!""}

          <p class="baz">
            <#list i_listThing.leafNode as i_leafNode>
              ${i_leafNode.node1!""} & ${i_leafNode.node2!""}
            </#list>
          </p>
        </#list>
      </p>
    </#list>
  </p>

  lotsa stuff here....
</div>