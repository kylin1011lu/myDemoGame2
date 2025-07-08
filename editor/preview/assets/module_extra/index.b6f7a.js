System.register("chunks:///_virtual/Layout_AboutMe.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(t){var e,o,r,n,i,u,a,c;return{setters:[function(t){e=t.applyDecoratedDescriptor,o=t.inheritsLoose,r=t.initializerDefineProperty,n=t.assertThisInitialized},function(t){i=t.cclegacy,u=t._decorator,a=t.Button,c=t.Component}],execute:function(){var l,s,p,y,b;i._RF.push({},"ef566+K4g1FM6XZ5ySGiuCg","Layout_AboutMe",void 0);var f=u.ccclass,_=u.property;t("Layout_AboutMe",(l=f("Layout_AboutMe"),s=_(a),l((b=e((y=function(t){function e(){for(var e,o=arguments.length,i=new Array(o),u=0;u<o;u++)i[u]=arguments[u];return e=t.call.apply(t,[this].concat(i))||this,r(e,"btnClose",b,n(e)),e}return o(e,t),e}(c)).prototype,"btnClose",[s],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),p=y))||p));i._RF.pop()}}}));

System.register("chunks:///_virtual/module_extra",["./Layout_AboutMe.ts","./UI_AboutMe_Impl.ts"],(function(){return{setters:[null,null],execute:function(){}}}));

System.register("chunks:///_virtual/UI_AboutMe_Impl.ts",["./rollupPluginModLoBabelHelpers.js","cc","./GameUILayers.ts","./ModuleDef.ts","./UIDef.ts","./Layout_AboutMe.ts"],(function(t){var e,o,n,u,s,i;return{setters:[function(t){e=t.inheritsLoose},function(t){o=t.cclegacy},function(t){n=t.GameUILayers},function(t){u=t.ModuleDef},function(t){s=t.UI_AboutMe},function(t){i=t.Layout_AboutMe}],execute:function(){var c;o._RF.push({},"b9113zWxwlLxpIz2ENLIXZG","UI_AboutMe_Impl",void 0);t("UI_AboutMe_Impl",tgx_class(u.EXTRA,s)(c=function(t){function o(){return t.call(this,"ui_about/UI_AboutMe",n.POPUP,i)||this}e(o,t);var u=o.prototype;return u.getRes=function(){return[]},u.onCreated=function(){var t=this,e=this.layout;this.onButtonEvent(e.btnClose,(function(){t.close()}))},o}(s))||c);o._RF.pop()}}}));

(function(r) {
  r('virtual:///prerequisite-imports/module_extra', 'chunks:///_virtual/module_extra'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});