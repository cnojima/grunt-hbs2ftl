<!--
<#--  test handlebars embedded #each  -->
-->

<div class="foo">
  <p>
    <#--  "this" is implied in hbs -->
    <#list (myVar)![] as i_myVar>
      ${(foo!"")?html} is ${(bar!"")?html}

      <p class="bar">
        <#list (listThing)![] as i_listThing>
          ${(yetAnotherFoo!"")?html} should be ${(yetAnotherBar!"")?html}

          <p class="baz">
            <#list (leafNode)![] as i_leafNode>
              ${(node1!"")?html} & ${(node2!"")?html}
            </#list>
          </p>
        </#list>
      </p>
    </#list>
  </p>

  lotsa stuff here....
</div>