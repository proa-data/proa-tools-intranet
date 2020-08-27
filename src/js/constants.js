( function() {
angular
	.module( 'proaTools.intranet' )
	.constant( 'PT_TEMPLATES', {
		login: '<div class="container loginContent">' +
				'<div class="banner">' +
					'<img class="img-responsive center-block" src="img/logo.png">' +
				'</div>' +
				'<div class="loginForm">' +
					'<div class="wellcome">' +
						'<p translate="login.wellcome1"></p>' +
						'<p translate="login.wellcome2"></p>' +
					'</div>' +
					'<form class="form-horizontal m-bottom" name="loginForm" novalidate ng-submit="submit(loginForm)">' +
						'<div class="form-group" ng-class="{\'has-error\': submitted&&loginForm.user.$error.required}">' +
							'<label class="col-sm-2 control-label"><span class="fas fa-user fa-lg"></span></label>' +
							'<div class="col-sm-10">' +
								'<input type="text" class="form-control" placeholder="{{\'login.name\' | translate}}" name="user" ng-model="loginData.user" required>' +
							'</div>' +
						'</div>' +
						'<div class="form-group" ng-class="{\'has-error\': submitted&&loginForm.pass.$error.required}">' +
							'<label class="col-sm-2 control-label"><span class="fas fa-lock fa-lg"></span></label>' +
							'<div class="col-sm-10">' +
								'<input type="password" class="form-control" placeholder="{{\'login.password\' | translate}}" name="pass" ng-model="loginData.pass" required>' +
							'</div>' +
						'</div>' +
						'<div class="form-group" ng-if="selectCompany">' +
							'<label class="col-sm-2 control-label"><span class="fas fa-users fa-lg"></span></label>' +
							'<div class="col-sm-10">' +
								'<select class="form-control" name="company" ng-model="userData.id_empresa" ng-options="item.id as item.name for item in companyItems" ng-change="submitWithCompany()"></select>' +
							'</div>' +
						'</div>' +
						'<button type="submit" class="btn btn-primary btn-block" ng-disabled="!isready" translate="login.login"></button>' +
					'</form>' +
					'<p class="alert alert-danger" ng-show="submitted&&loginForm.company.$error.required"><span translate="login.error.company1"><strong translate="login.error.company"></strong>.</p>' +
					'<p class="alert alert-danger" ng-show="submitted&&loginForm.user.$error.required"><span translate="error.initMas"></span><strong translate="login.error.name"></strong>.</p>' +
					'<p class="alert alert-danger" ng-show="submitted&&loginForm.pass.$error.required"><span translate="error.initFem"></span> <strong translate="login.error.password></strong>.</p>' +
					'<p class="alert alert-danger" ng-show="submitted&&notPermiss"><span translate="login.error.initNoLogin"></span><strong translate="login.error.noLogin"></strong>.</p>' +
					'<p class="alert alert-danger" ng-show="requiredUpdatePassword"><span translate="login.error.update_password_required"></span>.</p>' +
					'<p class="alert alert-danger" ng-show="submitted&&errorServer"><span translate="login.error.server1"></span><strong translate="login.error.server2"></strong>.</p>' +
				'</div>' +
			'</div>',
		main: '<header>' +
				'<nav class="navbar navbar-default">' +
					'<div class="container-fluid">' +
						'<div class="navbar-header">' +
							'<button type="button" class="navbar-toggle collapsed" ng-click="isNavCollapsed=!isNavCollapsed">' +
								'<span class="icon-bar"></span>' +
								'<span class="icon-bar"></span>' +
								'<span class="icon-bar"></span>' +
							'</button>' +
							'<div class="navbar-brand" ng-if="userData.logo_contenido">' +
								'<img ng-src="data:image/png;base64,{{userData.logo_contenido}}">' +
							'</div>' +
						'</div>' +
						'<div class="navbar-text">' +
							'<ol class="breadcrumb">' +
								'<li ng-repeat="item in breadcrumbList" ng-class="{active: item.sref}">' +
									'<a ui-sref="{{item.sref}}" translate="{{item.translationId}}" ng-if="item.sref"></a>' +
									'<span translate="{{item.translationId}}" ng-if="!item.sref"></span>' +
								'</li>' +
							'</ol>' +
						'</div>' +
						'<ul class="nav navbar-nav navbar-right">' +
							'<li uib-dropdown>' +
								'<a href="" uib-dropdown-toggle role="button">' +
									'{{userData.id_usuario}}' +
									' ' +
									'<img class="img-responsive img-circle" ng-src="data:image/jpeg;base64,{{userData.contenido_foto}}" onerror="this.onerror=null;this.src=\'img/default-avatar.jpg\'">' +
									' ' +
									'<span class="caret"></span>' +
								'</a>' +
								'<ul class="dropdown-menu">' +
									'<li class="dropdown-header">{{userData.nombre}}</li>' +
									'<li role="separator" class="divider"></li>' +
									'<li><a href="" ng-click="openModal()"><span class="fas fa-user fa-fw"></span> <span translate="manageUser.title_dropdown"></span></a></li>' +
									'<li><a href="" ng-click="logout()"><span class="fas fa-power-off fa-fw"></span> <span translate="manageUser.logout_dropdown"></span></a></li>' +
								'</ul>' +
							'</li>' +
						'</ul>' +
						'<div class="navbar-collapse" uib-collapse="isNavCollapsed">' +
							'<ul class="nav navbar-nav">' +
								'<li ng-repeat-start="item in navList" ng-if="isDisplayed(item)&&item.submenu">' +
									'<a href="" ng-init="isSubnavCollapsed=true" ng-click="isSubnavCollapsed=!isSubnavCollapsed">' +
										'<span ng-include="\'nav-content.html\'"></span>' +
										' ' +
										'<span class="caret"></span>' +
									'</a>' +
									'<ul class="nav navbar-nav" uib-collapse="isSubnavCollapsed">' +
										'<li ui-sref-active="active" ng-include="\'nav-link.html\'" ng-repeat="item in item.submenu" ng-if="isDisplayed(item)"></li>' +
									'</ul>' +
								'</li>' +
								'<li ui-sref-active="active" ng-include="\'nav-link.html\'" ng-repeat-end ng-if="isDisplayed(item)&&!item.submenu"></li>' +
							'</ul>' +
						'</div>' +
					'</div>' +
				'</nav>' +
				'<script type="text/ng-template" id="nav-link.html">' +
				'<a ui-sref="main.{{item.name}}" ng-include="\'nav-content.html\'"></a>' +
				'</script>' +
				'<script type="text/ng-template" id="nav-content.html">' +
				'<span class="fa-fw" ng-class="item.iconClassName"></span>' +
				' ' +
				'<span translate="{{item.name}}.title"></span>' +
				'</script>' +
			'</header>' +
			'<main class="container-fluid" ui-view></main>',
		modal: '<md-dialog flex="50">' +
				'<md-toolbar>' +
					'<div class="md-toolbar-tools">' +
						'<h2 translate="manageUser.title"></h2>' +
						'<span flex></span>' +
						'<md-button class="md-icon-button" ng-click="closeDialog()"><span class="fas fa-times"></span></md-button>' +
					'</div>' +
				'</md-toolbar>' +
				'<md-dialog-content>' +
					'<md-tabs md-selected="modalTabIndex" md-dynamic-height md-border-bottom>' +
						'<md-tab label="updateData">' +
							'<md-tab-label><span translate="manageUser.updateData"></span></md-tab-label>' +
							'<md-tab-body>' +
								'<div class="tab-body">' +
									'<form ng-submit="saveData()">' +
										'<p class="alert alert-danger" translate="error.noUserData" ng-show="isNoUserData()"></p>' +
										'<div class="form-group">' +
											'<label translate="manageUser.nif"></label>' +
											'<input type="text" class="form-control" ng-model="data.nif" required>' +
										'</div>' +
										'<div class="form-group">' +
											'<label translate="manageUser.email"></label>' +
											'<input type="email" class="form-control" ng-model="data.email" required>' +
										'</div>' +
										'<button type="submit" class="btn btn-primary" translate="save"></button>' +
									'</form>' +
								'</div>' +
							'</md-tab-body>' +
						'</md-tab>' +
						'<md-tab label="updatePassword">' +
							'<md-tab-label><span translate="manageUser.updatePassword"></span></md-tab-label>' +
							'<md-tab-body>' +
								'<div class="tab-body">' +
									'<form ng-submit="saveNewPassword()">' +
										'<div class="form-group" ng-class="{\'has-error\': failOldPassword&&submittedResetPassword}">' +
											'<label translate="manageUser.password.current"></label>' +
											'<input type="password" ng-model="resetPasswordForm.current_password" class="form-control" required>' +
										'</div>' +
										'<div class="form-group">' +
											'<label translate="manageUser.password.new"></label>' +
											'<input type="password" ng-model="resetPasswordForm.new_password" class="form-control" required>' +
										'</div>' +
										'<div class="form-group" ng-class="{\'has-error\': failSameNewPassword&&submittedResetPassword}">' +
											'<label translate="manageUser.password.repeatNew"></label>' +
											'<input type="password" ng-model="resetPasswordForm.repeat_new_password" class="form-control" required>' +
										'</div>' +
										'<p class="alert alert-danger" translate="manageUser.password.fail_new_password" ng-if="failSameNewPassword"></p>' +
										'<p class="alert alert-danger" translate="manageUser.password.fail_old_password" ng-if="failOldPassword"></p>' +
										'<button type="submit" class="btn btn-primary">' +
											'<span class="fas fa-sync-alt"></span>' +
											'<span translate="manageUser.password.update"></span>' +
										'</button>' +
									'</form>' +
								'</div>' +
							'</md-tab-body>' +
						'</md-tab>' +
						'<md-tab label="updatePicture">' +
							'<md-tab-label><span translate="manageUser.updatePicture"></span></md-tab-label>' +
							'<md-tab-body>' +
								'<div class="tab-body text-center">' +
									'<img id="profileImage" ng-src="data:image/jpeg;base64,{{photoContent}}" class="img-responsive img-circle center-block m-bottom" alt="Profile picture" onerror="this.onerror = null;this.src=\'img/default-avatar.jpg\'" width="150">' +
									'<input type="file" id="input-new-image" accept="image/*;capture=camera" onchange="angular.element(this).scope().processNewImage(this)" image="" resize-max-height="1000" resize-max-width="1000" resize-quality="0.7" resize-type="image/jpg" accept=".jpg,.jpeg,.png" class="hidden">' +
									'<button type="button" class="btn btn-primary" ng-click="getNewImage()"><span class="fas fa-camera fa-2x"></span></button>' +
								'</div>' +
							'</md-tab-body>' +
						'</md-tab>' +
					'</md-tabs>' +
				'</md-dialog-content>' +
			'</md-dialog>',
		home: '<h1 class="h3" translate="largeTitle"></h1>'
	} );
} )();