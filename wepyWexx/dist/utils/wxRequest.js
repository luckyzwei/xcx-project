'use strict';

function wxPromisify(fn) {
    return function () {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        return new Promise(function (resolve, reject) {
            obj.success = function (res) {
                //成功
                wx.hideToast();
                // console.log('→返回数据：'+ res.data)
                console.log('→end');
                resolve(res);
            };
            obj.fail = function (res) {
                //失败
                console.log('→请求失败：' + JSON.stringify(res));
                console.log('→end');
                wx.hideToast();
                reject(res);
            };
            fn(obj);
        });
    };
}
//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
    var P = this.constructor;
    return this.then(function (value) {
        return P.resolve(callback()).then(function () {
            return value;
        });
    }, function (reason) {
        return P.resolve(callback()).then(function () {
            throw reason;
        });
    });
};

/**
 * 微信请求，以是否有token传入判断是否走鉴权
 */

function wxRequest(url, token, data, type) {
    var datas = JSON.stringify(data);
    console.log('→start');
    console.log('→url：' + url);
    console.log('→data：' + datas);
    console.log('→type：' + type);
    wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
    });
    var wxtRequest = wxPromisify(wx.request);
    var header = {
        'Content-Type': 'application/json;charset=UTF-8'
    };
    if (token) {
        header = {
            'Content-Type': 'application/json;charset=UTF-8',
            "Authorization": token.type + ' ' + token.value //base64加密liz-youli-wx:secret
        };
    }
    return wxtRequest({
        url: url,
        method: type,
        data: datas,
        dataType: 'json',
        header: header
    });
}
module.exports = {
    fetch: wxRequest
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInd4UmVxdWVzdC5qcyJdLCJuYW1lcyI6WyJ3eFByb21pc2lmeSIsImZuIiwib2JqIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJzdWNjZXNzIiwicmVzIiwid3giLCJoaWRlVG9hc3QiLCJjb25zb2xlIiwibG9nIiwiZmFpbCIsIkpTT04iLCJzdHJpbmdpZnkiLCJwcm90b3R5cGUiLCJmaW5hbGx5IiwiY2FsbGJhY2siLCJQIiwiY29uc3RydWN0b3IiLCJ0aGVuIiwidmFsdWUiLCJyZWFzb24iLCJ3eFJlcXVlc3QiLCJ1cmwiLCJ0b2tlbiIsImRhdGEiLCJ0eXBlIiwiZGF0YXMiLCJzaG93VG9hc3QiLCJ0aXRsZSIsImljb24iLCJkdXJhdGlvbiIsInd4dFJlcXVlc3QiLCJyZXF1ZXN0IiwiaGVhZGVyIiwibWV0aG9kIiwiZGF0YVR5cGUiLCJtb2R1bGUiLCJleHBvcnRzIiwiZmV0Y2giXSwibWFwcGluZ3MiOiI7O0FBQ0EsU0FBU0EsV0FBVCxDQUFxQkMsRUFBckIsRUFBeUI7QUFDckIsV0FBTyxZQUFvQjtBQUFBLFlBQVZDLEdBQVUsdUVBQUosRUFBSTs7QUFDdkIsZUFBTyxJQUFJQyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3BDSCxnQkFBSUksT0FBSixHQUFjLFVBQVVDLEdBQVYsRUFBZTtBQUN6QjtBQUNBQyxtQkFBR0MsU0FBSDtBQUNBO0FBQ0FDLHdCQUFRQyxHQUFSLENBQVksTUFBWjtBQUNBUCx3QkFBUUcsR0FBUjtBQUNILGFBTkQ7QUFPQUwsZ0JBQUlVLElBQUosR0FBVyxVQUFVTCxHQUFWLEVBQWU7QUFDdEI7QUFDQUcsd0JBQVFDLEdBQVIsQ0FBWSxXQUFXRSxLQUFLQyxTQUFMLENBQWVQLEdBQWYsQ0FBdkI7QUFDQUcsd0JBQVFDLEdBQVIsQ0FBWSxNQUFaO0FBQ0FILG1CQUFHQyxTQUFIO0FBQ0FKLHVCQUFPRSxHQUFQO0FBQ0gsYUFORDtBQU9BTixlQUFHQyxHQUFIO0FBQ0gsU0FoQk0sQ0FBUDtBQWlCSCxLQWxCRDtBQW1CSDtBQUNEO0FBQ0FDLFFBQVFZLFNBQVIsQ0FBa0JDLE9BQWxCLEdBQTRCLFVBQVVDLFFBQVYsRUFBb0I7QUFDNUMsUUFBSUMsSUFBSSxLQUFLQyxXQUFiO0FBQ0EsV0FBTyxLQUFLQyxJQUFMLENBQ0g7QUFBQSxlQUFTRixFQUFFZCxPQUFGLENBQVVhLFVBQVYsRUFBc0JHLElBQXRCLENBQTJCO0FBQUEsbUJBQU1DLEtBQU47QUFBQSxTQUEzQixDQUFUO0FBQUEsS0FERyxFQUVIO0FBQUEsZUFBVUgsRUFBRWQsT0FBRixDQUFVYSxVQUFWLEVBQXNCRyxJQUF0QixDQUEyQixZQUFNO0FBQUUsa0JBQU1FLE1BQU47QUFBYyxTQUFqRCxDQUFWO0FBQUEsS0FGRyxDQUFQO0FBSUgsQ0FORDs7QUFRQTs7OztBQUlBLFNBQVNDLFNBQVQsQ0FBbUJDLEdBQW5CLEVBQXdCQyxLQUF4QixFQUErQkMsSUFBL0IsRUFBcUNDLElBQXJDLEVBQTJDO0FBQ3ZDLFFBQUlDLFFBQVFmLEtBQUtDLFNBQUwsQ0FBZVksSUFBZixDQUFaO0FBQ0FoQixZQUFRQyxHQUFSLENBQVksUUFBWjtBQUNBRCxZQUFRQyxHQUFSLENBQVksVUFBVWEsR0FBdEI7QUFDQWQsWUFBUUMsR0FBUixDQUFZLFdBQVdpQixLQUF2QjtBQUNBbEIsWUFBUUMsR0FBUixDQUFZLFdBQVdnQixJQUF2QjtBQUNBbkIsT0FBR3FCLFNBQUgsQ0FBYTtBQUNUQyxlQUFPLEtBREU7QUFFVEMsY0FBTSxTQUZHO0FBR1RDLGtCQUFVO0FBSEQsS0FBYjtBQUtBLFFBQUlDLGFBQWFqQyxZQUFZUSxHQUFHMEIsT0FBZixDQUFqQjtBQUNBLFFBQUlDLFNBQVM7QUFDVCx3QkFBZ0I7QUFEUCxLQUFiO0FBR0EsUUFBSVYsS0FBSixFQUFXO0FBQ1BVLGlCQUFTO0FBQ0wsNEJBQWdCLGdDQURYO0FBRUwsNkJBQWlCVixNQUFNRSxJQUFOLEdBQWEsR0FBYixHQUFtQkYsTUFBTUosS0FGckMsQ0FFMkM7QUFGM0MsU0FBVDtBQUlIO0FBQ0QsV0FBT1ksV0FBVztBQUNkVCxhQUFLQSxHQURTO0FBRWRZLGdCQUFRVCxJQUZNO0FBR2RELGNBQU1FLEtBSFE7QUFJZFMsa0JBQVUsTUFKSTtBQUtkRixnQkFBUUE7QUFMTSxLQUFYLENBQVA7QUFPSDtBQUNERyxPQUFPQyxPQUFQLEdBQWlCO0FBQ2JDLFdBQU9qQjtBQURNLENBQWpCIiwiZmlsZSI6Ind4UmVxdWVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuZnVuY3Rpb24gd3hQcm9taXNpZnkoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9iaiA9IHt9KSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBvYmouc3VjY2VzcyA9IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAvL+aIkOWKn1xuICAgICAgICAgICAgICAgIHd4LmhpZGVUb2FzdCgpXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ+KGkui/lOWbnuaVsOaNru+8micrIHJlcy5kYXRhKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfihpJlbmQnKVxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9iai5mYWlsID0gZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgIC8v5aSx6LSlXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+KGkuivt+axguWksei0pe+8micgKyBKU09OLnN0cmluZ2lmeShyZXMpKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfihpJlbmQnKVxuICAgICAgICAgICAgICAgIHd4LmhpZGVUb2FzdCgpXG4gICAgICAgICAgICAgICAgcmVqZWN0KHJlcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZuKG9iailcbiAgICAgICAgfSlcbiAgICB9XG59XG4vL+aXoOiuunByb21pc2Xlr7nosaHmnIDlkI7nirbmgIHlpoLkvZXpg73kvJrmiafooYxcblByb21pc2UucHJvdG90eXBlLmZpbmFsbHkgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICBsZXQgUCA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIHRoaXMudGhlbihcbiAgICAgICAgdmFsdWUgPT4gUC5yZXNvbHZlKGNhbGxiYWNrKCkpLnRoZW4oKCkgPT4gdmFsdWUpLFxuICAgICAgICByZWFzb24gPT4gUC5yZXNvbHZlKGNhbGxiYWNrKCkpLnRoZW4oKCkgPT4geyB0aHJvdyByZWFzb24gfSlcbiAgICApO1xufTtcblxuLyoqXG4gKiDlvq7kv6Hor7fmsYLvvIzku6XmmK/lkKbmnIl0b2tlbuS8oOWFpeWIpOaWreaYr+WQpui1sOmJtOadg1xuICovXG5cbmZ1bmN0aW9uIHd4UmVxdWVzdCh1cmwsIHRva2VuLCBkYXRhLCB0eXBlKSB7XG4gICAgdmFyIGRhdGFzID0gSlNPTi5zdHJpbmdpZnkoZGF0YSlcbiAgICBjb25zb2xlLmxvZygn4oaSc3RhcnQnKVxuICAgIGNvbnNvbGUubG9nKCfihpJ1cmzvvJonICsgdXJsKVxuICAgIGNvbnNvbGUubG9nKCfihpJkYXRh77yaJyArIGRhdGFzKVxuICAgIGNvbnNvbGUubG9nKCfihpJ0eXBl77yaJyArIHR5cGUpXG4gICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgdGl0bGU6ICfliqDovb3kuK0nLFxuICAgICAgICBpY29uOiAnbG9hZGluZycsXG4gICAgICAgIGR1cmF0aW9uOiAxMDAwMFxuICAgIH0pXG4gICAgdmFyIHd4dFJlcXVlc3QgPSB3eFByb21pc2lmeSh3eC5yZXF1ZXN0KTtcbiAgICB2YXIgaGVhZGVyID0ge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb247Y2hhcnNldD1VVEYtOCdcbiAgICB9O1xuICAgIGlmICh0b2tlbikge1xuICAgICAgICBoZWFkZXIgPSB7XG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb247Y2hhcnNldD1VVEYtOCcsXG4gICAgICAgICAgICBcIkF1dGhvcml6YXRpb25cIjogdG9rZW4udHlwZSArICcgJyArIHRva2VuLnZhbHVlIC8vYmFzZTY05Yqg5a+GbGl6LXlvdWxpLXd4OnNlY3JldFxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB3eHRSZXF1ZXN0KHtcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgIG1ldGhvZDogdHlwZSxcbiAgICAgICAgZGF0YTogZGF0YXMsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIGhlYWRlcjogaGVhZGVyXG4gICAgfSlcbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGZldGNoOiB3eFJlcXVlc3Rcbn0iXX0=