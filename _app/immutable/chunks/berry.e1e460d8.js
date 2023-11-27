const e=Object.freeze({$schema:"https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",name:"berry",patterns:[{include:"#controls"},{include:"#strings"},{include:"#comment-block"},{include:"#comments"},{include:"#keywords"},{include:"#function"},{include:"#member"},{include:"#identifier"},{include:"#number"},{include:"#operator"}],repository:{controls:{patterns:[{name:"keyword.control.berry",match:"\\b(if|elif|else|for|while|do|end|break|continue|return|try|except|raise)\\b"}]},strings:{patterns:[{name:"string.quoted.double.berry",begin:`("|')`,end:"\\1",patterns:[{name:"constant.character.escape.berry",match:`(\\\\x[\\h]{2})|(\\\\[0-7]{3})|(\\\\\\\\)|(\\\\")|(\\\\')|(\\\\a)|(\\\\b)|(\\\\f)|(\\\\n)|(\\\\r)|(\\\\t)|(\\\\v)`}]},{name:"string.quoted.other.berry",begin:`f("|')`,end:"\\1",patterns:[{name:"constant.character.escape.berry",match:`(\\\\x[\\h]{2})|(\\\\[0-7]{3})|(\\\\\\\\)|(\\\\")|(\\\\')|(\\\\a)|(\\\\b)|(\\\\f)|(\\\\n)|(\\\\r)|(\\\\t)|(\\\\v)`},{name:"string.quoted.other.berry",match:"\\{\\{[^\\}]*\\}\\}"},{name:"keyword.other.unit.berry",begin:"\\{",end:"\\}",patterns:[{include:"#keywords"},{include:"#numbers"},{include:"#identifier"},{include:"#operator"},{include:"#member"},{include:"#function"}]}]}]},"comment-block":{name:"comment.berry",begin:"\\#\\-",end:"\\-#",patterns:[{}]},comments:{name:"comment.line.berry",begin:"\\#",end:"\\n",patterns:[{}]},keywords:{patterns:[{name:"keyword.berry",match:"\\b(var|static|def|class|true|false|nil|self|super|import|as|_class)\\b"}]},identifier:{patterns:[{name:"identifier.berry",match:"\\b[_A-Za-z]\\w+\\b"}]},number:{patterns:[{name:"constant.numeric.berry",match:"0x[a-fA-F0-9]+|\\d+|(\\d+\\.?|\\.\\d)\\d*([eE][+-]?\\d+)?"}]},operator:{patterns:[{name:"keyword.operator.berry",match:"\\(|\\)|\\[|\\]|\\.|-|\\!|~|\\*|/|%|\\+|&|\\^|\\||<|>|=|:"}]},member:{patterns:[{match:"\\.([a-zA-Z_][a-zA-Z0-9_]*)",captures:{0:{name:"entity.other.attribute-name.berry"}}}]},function:{patterns:[{name:"entity.name.function.berry",match:"\\b([a-zA-Z_][a-zA-Z0-9_]*(?=\\s*\\())"}]}},scopeName:"source.berry",displayName:"Berry",aliases:["be"]});var r=[e];export{r as default};
