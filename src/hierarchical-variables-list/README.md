# Hierarchical List

### Members

#### Group

* Is selectable (if one of its Items children are ranked)

#### Entities

* Always belongs to a Group
* Is an ordered collection of Item(s) and/or Group(s)
* Is scrollable :  meaning it supports a strategy for exposing a limited set of its members
for DOM buffering

#### Entity

* Is rankable (ie primary, secondary, etc)
* Interface _only_


###  Presentation Concerns

* Accordionable



```html
<ol class="hierarchical-list">
    <li class="group">
        <!--directive-->
        <header class="header">
        </header>
        <ol class="entities">
            <li class="entity"></li>
        </ol>
    </li>
    <li class="group">
        <!--directive-->
        <header class="header">
        </header>
        <ol class="entities">
            <li class="entity">
            </li>
            <--note deep recursion-->
            <li class="group">
                <header class="header">
                </header>
                <ol class="entities">
                    <li class="entity">
                    </li>
                </ol>
            </li>
            <li class="entity">
            </li>
        </ol>
    </li>
</ol>

```



#### Considerations

* How can we have the directive simply expose an interface for 'group' and 'entity'?

### To enable
 
 * add hierarchical-variables and hierarchical-variables-list to features-list
 * use default-dataset-nav-with-hierarchical.html for the sidebar container


#### Stories having this list

TERMS:

* `selectable` = clickable + indicates selection (with css)
* `linkable` = drag/drop support with `link` operation
* `clickable` = clickable but does not indicate a selection (as css)

* filter-builder : variable-item is linkable, clickable
* filter-editor: variable-item is linkable, clickable
* analyze: variable-item is selectable, linkable
* build-categorical-array/multiple-response: variable-item is linkable,clickable

#### Directives

* hierarchical-variables-list
    * group
        * variable
            * composite 
                * scalar
            * scalar





