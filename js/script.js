var filedrag = $("#filedrag");
var code = $("#code");
var control = $("#control");
var stack = $("#stack ul");
var tblsymb = $("#tblsymb");
var myConsole = $("#console");

var reader = new FileReader();
reader.onloadend = function(e) {
    if (e.target.readyState == FileReader.DONE) {
        VM.loadFile(e.target.result, function (contents) {
            contents.forEach(function (line) {
                code.append('<li class="text-muted">'+line+'</li>')
            });
            filedrag.hide();
            control.show();
        });
    }
};

VM.onStackPush = function (arg) {
    stack.append('<li>'+arg+'</li>');
};

VM.onStackPop = function () {
    stack.find(':last-child').remove();
};

VM.onTsAdd = function (name, val) {
    tblsymb.append('<tr><td>'+name+'</td><td>'+val+'</td></tr>');
};

VM.onTsStore = function (i, val) {
    tblsymb.find('tr:nth-child('+(i+1)+') td:last-child').text(val);
};

VM.onPcUpdate = function (pc) {
    code.find('li').removeClass('current-code');
    code.find(':nth-child('+pc+')').addClass('current-code');
};

VM.onReset = function () {
    code.empty();
    stack.empty();
    tblsymb.empty();
    myConsole.html(" &gt; ");
};

VM.print = function (str) {
    str = str.replace('\n', '<br/>');
    myConsole.append(str);
};

VM.read = function () {
    var str = prompt("Input", "");
    return str;
};

$('#executeOne').click(function (e) {
    VM.executeOne();
});

$('#executeAll').click(function (e) {
    execute = setInterval(function () { VM.executeOne(); }, 200);
});

$('#executePause').click(function (e) {
    clearInterval(execute);
});

$('#executeStop').click(function (e) {
    clearInterval(execute);
    VM.reset();
    filedrag.show();
    control.hide();
});
    
filedrag.on('drop', function(e) {
    e.stopPropagation();
    e.preventDefault();
    var file = e.originalEvent.dataTransfer.files[0];
    reader.readAsText(file);
});

filedrag.on('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    filedrag.addClass('dragover');
});

filedrag.on('dragleave', function(e) {
    e.stopPropagation();
    e.preventDefault();
    filedrag.removeClass('dragover');
});
