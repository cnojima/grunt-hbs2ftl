<!--
<#--  test handlebars embedded #each  -->
-->

<div class="foo">
  <p>
    <#--  "this" is implied in hbs -->
    <#list (myVar)![] as i_myVar>
      ${foo!""} is ${bar!""}

      <p class="bar">
        <#list (listThing)![] as i_listThing>
          ${yetAnotherFoo!""} should be ${yetAnotherBar!""}

          <p class="baz">
            <#list (leafNode)![] as i_leafNode>
              ${node1!""} & ${node2!""}
            </#list>
          </p>
        </#list>
      </p>
    </#list>
  </p>

  lotsa stuff here....
</div>