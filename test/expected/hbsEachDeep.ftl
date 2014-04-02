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

    <#--  peer of top-level #each -->
    <ul>
    <#list (foo2)![] as i_foo2>
      <li>
        ${(foosAttribute1!"")?html}

        <#--  embedded each -->
        <#list (fooList)![] as i_fooList>
          meh
          <#list (foo3)![] as i_foo3>
            <a href="#">${(someThingElse!"")?html}</a>
          </#list>
        </#list>

        <#--  embedded #each, peer level 2 -->
        <#list (fooList2)![] as i_fooList2>
          <a href="#">${(someAttr!"")?html}</a><br/>
        </#list>
      </li>
    </#list>
    </ul>
  </p>

  lotsa stuff here....
</div>