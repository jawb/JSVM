var VM = {

    tblsymb: {},
    stack:   [],
    code:    [],
    pc:      0,


    onStackPush: function (arg) {},
    onStackPop: function () {},
    onTsAdd: function (name, value) {},
    onTsStore: function (i, val) {},
    onPcUpdate: function (pc) {},
    onReset: function () {},

    print: function (str) {},
    read: function () {},


    reset: function () {
        this.tblsymb = {};
        this.stack = [];
        this.code = [];
        this.pc = 0;
        this.onReset();
    },

    stackPush: function (arg) {
        this.stack.push(arg);
        this.onStackPush(arg);
    },

    stackPop: function () {
        var r = this.stack.pop();
        this.onStackPop();
        return r;
    },

    tsAdd: function (name) {
        this.tblsymb[name] = 0;
        this.onTsAdd(name, 0);
    },

    tsStore: function (name, val) {
        var i = Object.keys(this.tblsymb).indexOf(name);
        this.tblsymb[name] = val;
        this.onTsStore(i, val);
    },

    loadFile: function(string, callback) {
        this.reset();
        var contents = string.split("\n");
        contents = contents.filter(function (el) {return el != "";});
        for (var i=0, l=contents.length; i<l; ++i) {
            var regex = /[a-zA-Z_0-9]*:/g;
            if (regex.test(contents[i])) {
                var op = {
                    op  : "LABEL",
                    arg : contents[i].substring(0, contents[i].length-1)
                }
                this.code.push(op);
            }
            else {
                var inst = contents[i].split(" ");
                if (inst[0] == "PUSH") inst[1] = parseFloat(inst[1]);
                var op = {
                    op  : inst[0],
                    arg : inst[1]
                }
                this.code.push(op);
            }
        }
        callback(contents);
    },

    jumpTo: function (label) {
        for (var i=0, l=this.code.length; i<l; ++i) {
            if (this.code[i].op == "LABEL" && this.code[i].arg == label) {
                this.pc = i;
            }
        }
    },

    executeOne: function() {

        var arg = this.code[this.pc].arg;
        var ts  = this.tblsymb;

        switch (this.code[this.pc].op) {

            case "DATA":
                if (typeof ts[arg] == 'undefined')
                    this.tsAdd(arg);
                break;

            case "LOAD":
                if (ts.hasOwnProperty(arg))
                    this.stackPush(ts[arg]);
                break;

            case "STORE":
                if (ts.hasOwnProperty(arg))
                    this.tsStore(arg, this.stackPop());
                break;

            case "PUSH":
                this.stackPush(arg);
                break;

            case "POP":
                this.stackPop();
                break;

            case "ADD":
                var value1 = this.stackPop();
                var value2 = this.stackPop();
                this.stackPush(value1 + value2);
                break;

            case "SUB":
                var value1 = this.stackPop();
                var value2 = this.stackPop();
                this.stackPush(value1 - value2);
                break;

            case "MULT":
                var value1 = this.stackPop();
                var value2 = this.stackPop();
                this.stackPush(value1 * value2);
                break;

            case "DIV":
                var value1 = this.stackPop();
                var value2 = this.stackPop();
                this.stackPush(value1 / value2);
                break;

            case "MOD":
                var value1 = this.stackPop();
                var value2 = this.stackPop();
                this.stackPush(value1 % value2);
                break;

            case "AND":
                var value1 = this.stackPop();
                var value2 = this.stackPop();
                this.stackPush((value1 && value2) + 0);
                break;

            case "OR":
                var value1 = this.stackPop();
                var value2 = this.stackPop();
                this.stackPush((value1 || value2) + 0);
                break;

            case "NOT":
                var value1 = this.stackPop();
                this.stackPush(!value1+0);
                break;

            case "LT":
                var value1 = this.stackPop();
                var value2 = this.stackPop();
                this.stackPush((value1 < value2) + 0);
                break;

            case "LE":
                var value1 = this.stackPop();
                var value2 = this.stackPop();
                this.stackPush((value1 <= value2) + 0);
                break;

            case "JMP":
                this.jumpTo(arg);
                break;

            case "BEQ":
                var value1 = this.stackPop();
                if (value1 == 0) this.jumpTo(arg);
                break;

            case "BNE":
                var value1 = this.stackPop();
                if (value1 == 1) this.jumpTo(arg);
                break;

            case "PRINT":
                var str = "", c;
                while ((c = this.stackPop()) != 0) {
                    str += String.fromCharCode(c);
                }
                this.print(str);
                break;

            case "PRINTN":
                this.print(this.stackPop()+"");
                break;

            case "READ":
                var input = this.read();
                var that = this;
                input = input.split('').reverse();
                that.stackPush(0);
                input.forEach(function (c) {
                    that.stackPush(c.charCodeAt(0));
                });
                break;

            case "READN":
                var input = parseFloat(this.read());
                this.stackPush(input);
                break;
        }
        if (this.pc < this.code.length-1) {
            ++this.pc;
            this.onPcUpdate(this.pc);
        }
        else return false;
    }

}
