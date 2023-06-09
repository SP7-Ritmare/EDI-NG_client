# Datatypes available for EDI Templates
## code (alias: codelist)
Item value comes from a SPARQL codelist shown as a combo box (HTML *select* element):
returned fields MUST be:
* ?c (uri),
* ?urn (optional urn),
* ?l (in-language label),
* ?a (alternative language label)
* ?z (language-neutral label)

## select
Item value depends on field from shared datasource.
Whenever datasource is refreshed, item will be updated with the corresponding field value.
Value can be manually overridden, but subsequent refresh on the datasource will always win.
## copy
Item takes value from another item whenever the latter is updated.
Value can be manually overridden, but subsequent change on the main item will always win.
## string
Item is a string
## URN
Item is a URM
## URI
Item is a URI
## URL
Item is a URL (reachability of URL is not tested yet)
## int
Item is an integer
## real (alias: double)
Item is a real number
## text
Item is a long text
## dependent

## ref
Item is a reference to another item.
ref fields are not shown and they get expanded when EDIML gets compiled into XML
## autonumber
Item is an automatically generated integer
## hidden
Item is hidden
## date
Item is a date
## dateRange
Item is a date range using two date pickers as input controls
## boundingBox
Item is a bounding box, i.e. 4 textboxes representing N, S, E and W.
A map is also shown to allow displaying and setting the coordinates on map.
