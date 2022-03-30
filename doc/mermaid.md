# Mermaid

-   [Mermaid docs](https://mermaid-js.github.io/mermaid/)
-   [VSCODE Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid) for Markdown Preview

### secuencia

```mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
```

## otro

```mermaid
graph LR
    A-->B-->J;
    B-->CK(fa:fa-check)-->J(fa:fa-coffee)
    A-->C-->CK;
    C-->D-->J;
    C-->D-->CK;
```

```mermaid
graph LR
install[Install Plugin]
install --> configure[Configure Plugin]
configure --> draw[Draw Fancy Diagrams]
```

### gant

```mermaid
gantt
dateFormat  YYYY-MM-DD
title Adding GANTT diagram to mermaid
excludes weekdays 2014-01-10

section A section
Completed task            :done,    des1, 2014-01-06,2014-01-08
Future task               :         des3, after des1, 1d
Active task               :active,  des2, 2014-01-09, 3d
Future task2               :         des4, after des3, 5d
```

## Class diagram

```mermaid
classDiagram
Class01 <|-- AveryLongClass : Cool
Class03 *-- Class04
Class05 o-- Class06
Class07 .. Class08
Class09 --> C2 : Where am i?
Class09 --* C3
Class09 --|> Class07
Class07 : equals()
Class07 : Object[] elementData
Class01 : size()
Class01 : int chimp
Class01 : int gorilla
Class08 <--> C2: Cool label
```

## graph experimental

```mermaid
gitGraph:
options
{
    "nodeSpacing": 100,
    "nodeRadius": 20
}
end
commit
branch newbranch
branch newbranch
checkout newbranch
commit
commit
checkout master
commit
commit
merge newbranch
```
