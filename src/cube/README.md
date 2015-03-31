## Whaam Cube

The whaam cube holds multidimensional numerical data and metadata in a
js object, for display and persistence as a ‘saved analysis’.

### Properties

- `dimension` — the number of dimensions
- `valid` — the number of valid observations used to calculate the result,
  rows considered minus rows missing
- `labels` — array of arrays: the names or values of categories or enumerations
  along the dimensions.
- `_dimensions` — the enumerations provided by the crunch:cube (see below)
- `nMissing` — the number of missing observations encountered during calculation
- `weightId` — the id of the weight variable used in calculation
- `appliedFilters` — array of ids of filters used

### Measures

The cube can contain one or more _measures_, or numeric results calculated
given the dimension specification. The most common one encountered in Crunch
data is _count_, for cross-tabulations of categorical or discretized (binned)
variables. Counts have special extensions for _margins_, and _percentages_ with
respect to margins.

### Cube utils

The Whaam cube implements a variant of the numpy ndarray interface to 2- and 3-
dimensional arrays, to enable margin computation and division by margins (the
‘sweep’ operator).

#### Sorting

#### Pruning

### Making cube queries

The `cubeQuery` builds an object from analysis variableList and measure
components. At a minimum, these contain a variableId ‘self’ and a ‘dimension’
key that indicates how each component is to be used (default ‘variable’). The
cube query turns user/analysis representations of variables into a form
suitable for dimension-specification:

- categorical, text: no change
- numeric: bin function
- datetime: bin function
- categorical array (subvariables): ‘each’ function
- categorical array (categories): ‘variable’
- multiple response: silently add a ‘selected array’ mask

The `iFetchCubes` service requests a cube given a datasetId and a cube query.

### crunch:cube → whaam cube

A whaam cube is constructed from the data and metadata in a crunch:cube server
result, using the `fromCrCube` method. Each variable type used as a dimension
yields slightly different metadata, for which dimension subclasses are used to
construct cubes of the correct valid _shape_ and with usable _labels_. Each
measure, of identical valid shape, is stored in the whaam cube keyed by name.
