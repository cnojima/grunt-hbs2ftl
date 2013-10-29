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

    <#--  peer of top-level #each -->
    <ul>
    <#list foo2 as i_foo2>
      <li>
        ${i_foo2.foosAttribute1!""}

        <#--  embedded each -->
        <#list i_foo2.fooList as i_fooList>
          meh
          <#list i_fooList.foo3 as i_foo3>
            <a href="#">${i_foo3.someThingElse!""}</a>
          </#list>
        </#list>

        <#--  embedded #each, peer level 2 -->
        <#list i_foo2.fooList2 as i_fooList2>
          <a href="#">${i_fooList2.someAttr!""}</a><br/>
        </#list>
      </li>
    </#list>
    </ul>
  </p>

  lotsa stuff here....
</div>