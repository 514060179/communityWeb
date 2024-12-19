(function() {
    window.loadJS = function(url, callback) {
        let script = document.createElement('script'),
            fn = callback || function() {};
        script.type = 'text/javascript';
        //IE
        if (script.readyState) {
            script.onreadystatechange = function() {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null;
                    fn();
                }
            };
        } else {
            //其他浏览器
            script.onload = function() {
                fn();
            };
        }
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    //let _langObj = vc.getData('property-lang')
    let _langObj = JSON.parse(window.localStorage.getItem('property-lang'));
    let _lang = 'cn';
    if (_langObj) {
        _lang = _langObj.lang;
    }

    loadJS('/vcCore/vc-' + _lang + ".js")
})(window.vcFramework)