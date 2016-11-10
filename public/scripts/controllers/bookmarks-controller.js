app.controller('bookmarksCtr', ['$scope', '$state', '$stateParams', '$filter', '$window', 'bookmarkService', 'pubSubService', function($scope, $state, $stateParams, $filter, $window, bookmarkService, pubSubService) {
    console.log("Hello bookmarksCtr...", $stateParams);
    $scope.bookmarks = []; // 书签数据
    $scope.showSearch = false; // 书签数据
    $scope.hoverItem = false;
    $scope.showStyle = 'navigate'; // 显示风格'navigate', 'card', 'table'
    $scope.b = [];
    semanticInit();

    var params = {
        show: $scope.showStyle,
    }

    $scope.jumpToUrl = function(url, id) {
        $window.open(url, '_blank');
        bookmarkService.clickBookmark({
            id: id
        });
    }
    getBookmarks(params);
    pubSubService.subscribe('MenuCtr.bookmarks', $scope, function(event, params) {
        console.log('subscribe MenuCtr.bookmarks', params);
        getBookmarks(params);
    });

    pubSubService.subscribe('MenuCtr.searchBookmarks', $scope, function(event, params) {
        console.log('subscribe MenuCtr.searchBookmarks', params);
        getBookmarks(params);
    });

    pubSubService.subscribe('EditCtr.inserBookmarsSuccess', $scope, function(event, params) {
        console.log('subscribe EditCtr.inserBookmarsSuccess', params);
        getBookmarks(params);
    });

    function getBookmarks(params) {
        bookmarkService.getBookmarks(params).then(
            function(data) {
                $scope.bookmarks = data;
                pubSubService.publish('loginCtr.login', {
                    'login': true,
                });
            },
            function(data) {
                console.log(data);
                $state.go('/');
                pubSubService.publish('loginCtr.login', {
                    'login': false,
                });
            }
        );
    }

    function semanticInit() {
        setTimeout(() => {
            $('.ui.dropdown').dropdown();
            $('.ui.calendar.js-date-begin').calendar({
                type: 'date',
                formatter: {
                    date: function(date, settings) {
                        if (!date) return '';
                        var day = date.getDate();
                        var month = date.getMonth() + 1;
                        var year = date.getFullYear();
                        return year + '/' + month + '/' + day;
                    }
                },
                endCalendar: $('.ui.calendar.js-date-end')
            });
            $('.ui.calendar.js-date-end').calendar({
                type: 'date',
                formatter: {
                    date: function(date, settings) {
                        if (!date) return '';
                        var day = date.getDate();
                        var month = date.getMonth() + 1;
                        var year = date.getFullYear();
                        return year + '/' + month + '/' + day;
                    }
                },
                startCalendar: $('.ui.calendar.js-date-begin')
            });
        }, 100);
    }
}]);
