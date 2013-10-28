<!--
<#--  test handlebars embedded #each  -->
-->

<div class="foo">
  <p>
    <#--  "this" is implied in hbs -->
    <#list myVar as i_myVar>
      ${i_myVar.foo!""} is ${i_myVar.bar!""}

      <p class="bar">
        <#list i_myVar.listThing as i_listThing></#list>
          ${i_listThing.yetAnotherFoo!""} should be ${i_listThing.yetAnotherBar!""}

          <p class="baz">
            <#list i_listThing.leafNode as i_listThing_leafNode>
              ${i_listThing_leafNode.node1!""} & ${i_listThing_leafNode.node2!""}
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
        <#list i_foo2.fooList as i_foo2_fooList>

        </#list>

        <#--  embedded #each, peer level 2 -->
        <#list i_foo2.fooList2 as i_foo2_footList2>
          <a href="#">${i_foo2_footList2.someAttr!""}</a><br/>
        </#list>
      </li>
    </#list>
  </ul>
  </p>

  lotsa stuff here....
</div>