"use strict";
import _ from './underscore-1.8.3';
console.log(_);
(function(dependencies) {
  console.log(dependencies);
    var util = dependencies.util;
    var global = dependencies.global;

    function ObserverList() {

        var checkIndexOutBound = function(index, bound) {
            return index > -1 && index < bound;
        };

        this.observerList = [];

        this.add = function(observer, force) {
            force && (this.observerList.length = 0);
            this.observerList.push(observer);
        };

        this.get = function(index) {
            if (checkIndexOutBound(index, this.observerList.length)) {
                return this.observerList[index];
            }
        };

        this.count = function() {
            return this.observerList.length;
        };

        this.removeAt = function(index) {
            checkIndexOutBound(index, this.observerList.length) && this.observerList.splice(index, 1);
        };

        this.remove = function(observer) {
            if (!observer) {
                this.observerList.length = 0;
                return;
            }
            observer = Object.prototype.toString.call(observer) == '[object Function]' ? [observer] : observer;
            for (var i = 0, len = this.observerList.length; i < len; i++) {
                if (this.observerList[i] === observer[i]) {
                    this.removeAt(i);
                    break;
                }
            }
        };

        this.notify = function(val) {
            for (var i = 0, len = this.observerList.length; i < len; i++) {
                this.observerList[i](val);
            }
        };

        this.indexOf = function(observer, startIndex) {
            var i = startIndex || 0,
                len = this.observerList.length;
            while (i < len) {
                if (this.observerList[i] === observer) {
                    return i;
                }
                i++;
            }
            return -1;
        };
    }

    var cache = function(){
        var session = {};

        var set = function(key, value){
            session[key] = value;
        };

        var get = function(key){
            return session[key];
        };

        var remove = function(key){
            delete session[key];
        };

        var update = function(key, value){
            set(key, value);
        };
        return {
            set: set,
            get: get,
            update: update,
            remove: remove
        };
    };

    var tplEngine = function(temp, data, regexp){
        if (!(Object.prototype.toString.call(data) === "[object Array]")) {
            data = [data];
        }
        var ret = [];
        for (var i = 0, j = data.length; i < j; i++) {
            ret.push(replaceAction(data[i]));
        }
        return ret.join("");

        function replaceAction(object) {
            return temp.replace(regexp || (/{([^}]+)}/g), function(match, name) {
                if (match.charAt(0) == '\\') {
                    return match.slice(1);
                }
                return (object[name] != undefined) ? object[name] : '{' + name + '}';
            });
        }
    };

    global.RongCallUtil = {
        ObserverList: ObserverList,
        cache: cache,
        tplEngine: tplEngine
    };

})({
    global: window,
    util: _
});
