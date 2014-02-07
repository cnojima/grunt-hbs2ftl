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

    <#--  peer of top-level #each -->
    <ul>
    <#list (foo2)![] as i_foo2>
      <li>
        ${foosAttribute1!""}

        <#--  embedded each -->
        <#list (fooList)![] as i_fooList>
          meh
          <#list (foo3)![] as i_foo3>
            <a href="#">${someThingElse!""}</a>
          </#list>
        </#list>

        <#--  embedded #each, peer level 2 -->
        <#list (fooList2)![] as i_fooList2>
          <a href="#">${someAttr!""}</a><br/>
        </#list>
      </li>
    </#list>
    </ul>
  </p>

  lotsa stuff here....
</div>