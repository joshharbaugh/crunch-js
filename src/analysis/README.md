## Analysis state

### States:

- empty
- loading
- loaded

### Properties:

- variables
- measures

#### variableList

Contains objects that mediate the user representation of a variable and how
it can be used as a dimension. In general a user will see a ‘name’, but
the variable object used in the variable list contains richer information like
the _type_ and any other information used to customize a query (for example,
datetime variables need a _rollup_).

The variable list is an ordered array, so its first element corresponds to
the result's _rows_, second to _columns_, &c. The `variableList` provides
methods to manage and get its contents:

- add(variableId)
- replace(index, variableId)
- remove(index)
- at(index)
- valueOf
- clean
- count

#### measures

Contains measures and (if applicable) any associated variables.


## Generators

When variables or measures change, the analysis will call its `recalculate`
method, of which the result is expected to be a displayable result (currently,
an Xtab).

A basic generator chain of methods is: build a cube query, fetch that result,
produce a whaam cube, and then turn the whaam cube into a displayable result,
which is placed directly on scope and consumed by markup or graph directives.

A saved analysis must load a cube query from the deck, reconstruct the
(user-facing) _variables_ and _measures_ from the query, then do all of the
above, and apply any saved user settings.
