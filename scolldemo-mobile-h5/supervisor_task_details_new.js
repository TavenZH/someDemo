
//记录滑动的起点和中点的方位信息
var TouchPage = {
	"start_x":0,
	"start_y":0,
	"end_x":0,
	"end_y":0,
}
/**
 * 页面渲染js入口
 */
$(document).ready(function() {
	pageinit();
	/**
	 * 页面加载
	 */
	function pageinit() {
		initPage();
		//关联点击事件
		$(document).on("click", "#takephoto", takephoto);
		$(document).on("click", "#SINGLE_PROJECT_NAME",viewProjectInfoHandler);
		// 操作1
		$(document).on("click", "#viewuser",viewuserHandler);
		//操作2
		$(document).on("click", "#problemReport", problemReportHandler);
		//操作3
		$(document).on("click", "#outBtn", signOutHandler);
		//操作4
		$(document).on("click", "#auditbtn", auditHandler);
		//操作5
		$(document).on("click", "#submitbtn", submitHandler);
		//打开窗口
		$(document).on("click", "#SJ_START", showSjWin);
		//关闭窗口
		$(document).on("click", "#CLOSE_IMG", closeSjWin);
		//操作6
		$(document).on("click", "#QD_BUTTON", dosjOrbsj);	
		//展示大图
		$(document).on("click", ".show-big-img", showPicture);
		//关闭大图
		$(document).on("click", "#imgModal", closeImgMode);
		//操作7
		$(document).on("click", "#PHOTO_UPLOAD", doUploadPhoto);
		//滑动面板开始事件
		$(document).on("touchstart", ".photo-div-panl", doTouchStart);	
		//滑动面板结束事件
		$(document).on("touchend", ".photo-div-panl", doTouchEnd);
		//表单数据初始化
		function initPage(){
			pageJson = initJson;
			initProjectBasicInfo(pageJson);
			initButton(pageJson);
			initPhotoList(pageJson);		
		}
		
		/**
		 * 设置页面头部的信息
		 */
		function initProjectBasicInfo(pageJson) {
			$("#SINGLE_PROJECT_NAME").html(pageJson.PROJECT_NAME||"");
			$("#PROJECT_NAME").html(pageJson.DEPT_NAME||"");
			if(pageJson.BUILD_ADDR){
				$("#PROJECT_ADD").html(pageJson.BUILD_ADDR);
			}else{
				$("#PROJECT_ADD_ROW").css("display","none");
			}	
			$("#BUILD_DEPT").html(pageJson.BUILD_DEPT||"");
		}

		/**
		 * 设置页面中部的操作权限
		 */
		function initButton(pageJson) {
			var actionDiv = $(".action_div1").width();
			if(actionDiv && actionDiv != 0){
				$(".action_img1").css("height",actionDiv*0.7);
				$(".action_img1").css("width",actionDiv*0.7);
			}

			if(pageJson.IS_EDIT == "0" || pageJson.TASK_STATE == "3"){
				$("#RYHS_IMG").attr("src","images/jlrw/ryhs_2.png");
				$("#RYHS_IMG").attr("date-cz","0");

				$("#WTSB_IMG").attr("src","images/jlrw/wtsb_2.png");
				$("#WTSB_IMG").attr("date-cz","0");

				$("#RWTJ_IMG").attr("src","images/jlrw/rwtj_2.png");
				$("#RWTJ_IMG").attr("date-cz","0");

				$("#GCQT_IMG").attr("src","images/jlrw/gcqt_2.png");
				$("#GCQT_IMG").attr("date-cz","0");
			}else if ( pageJson.TASK_STATE == "2"){
				$("#RYHS_IMG").attr("src","images/jlrw/ryhs_2.png");
				$("#RYHS_IMG").attr("date-cz","0");

				$("#WTSB_IMG").attr("src","images/jlrw/wtsb_2.png");
				$("#WTSB_IMG").attr("date-cz","0");

				$("#RWTJ_IMG").attr("src","images/jlrw/rwtj_2.png");
				$("#RWTJ_IMG").attr("date-cz","0");
			}
			if(pageJson.TASK_STATE == "2"){
				$("#LOGIN_IN_OUT").html("工程签到");
			}
		}

		/**
		 * 设置页面底部的信息
		 */
		 function initPhotoList(pageJson) {
			var jso = getPhotoPanlHtml(pageJson,0,0,new Array());
			showPhotoPanl(pageJson,jso);
		}

		/**
		 * 获取面板内容html
		 * 递归调用，每次加载一个面板信息
		 * templateList：模板数据  panlWidth：面板宽度
		 */
		function getPhotoPanlHtml(templateList,forNum,panlNum,panlArr){
			var templateList = pageJson.BO_TEMPLATE_DETAIL_VER;
			if(!templateList){
				var photoPanlHtml = "<div class=\"photo-div-panl\"><h1>没有请求到面板信息，请联系管理员</h1></div>";
				var jso = {"photoPanlHtml":photoPanlHtml,"panlNum":1};
		 		return jso;
			}
			//图片需要动态高度宽度
			var pointArr = templateList[forNum].BO_CRITICAL_POINT_VER;
			var pointNum = pointArr.length;
			for(var i = 0; i < pointNum; i++){
				var statusJso = gePhotoButtonStatus(pageJson,forNum,i);//获取当前面板的各种按钮状态
				panlArr.push("<div class=\"photo-div-panl\" >" );
				panlArr.push("	<div class=\"photo-panl-base\">"); 
				panlArr = panlArr.concat(getTemplateHtml(templateList,statusJso,i,pointNum,forNum));//面板头部分
				panlArr.push("		<div class=\"photo-bottom\">");
				panlArr = panlArr.concat(getPointInfoHtml(pointArr,statusJso,i));//面板说明部分
				panlArr = panlArr.concat(getPhotoInfoHtml(pointArr,statusJso,i));//面板照片信息部分
				panlArr.push("		</div>");
				panlArr.push("	</div>");
				panlArr.push("</div>");
				panlNum++;
			}
			//根据逻辑判断是否递归
			if( templateList[forNum + 1] && 
					(templateList[forNum].IS_COMPLETED == '1'
						||templateList[forNum].PHOTO_ORDER == templateList[forNum + 1].PHOTO_ORDER )){
				return getPhotoPanlHtml(templateList,++forNum,panlNum,panlArr);
			}
			//如果最后一个面板。可以再加载特殊信息
			if(forNum > 0 && statusJso.isSumbit == "1" &&
				forNum + 1 == templateList.length && templateList[forNum].IS_COMPLETED == '1'){
				panlArr.push("<div class=\"photo-div-panl\" id=\"SUMBIT_PANL\">" );
				panlArr.push("	<div class=\"photo-panl-base\">");
				panlArr =			panlArr.concat(getSumbitHtml());
				panlArr.push("	</div>");
				panlArr.push("</div>");
				++panlNum;
			}
		 	var photoPanlHtml = panlArr.join("");
		 	var jso = {"photoPanlHtml":photoPanlHtml,"panlNum":panlNum};
		 	return jso;
		}
		/**
		 * 获取页面html
		 */
		function getSumbitHtml(){
			var htmlArr = new Array();
			htmlArr.push("<div class=\"photo-template-green\">");
			htmlArr.push("	<div class=\"photo-template-div1\"> ");
			htmlArr.push("		提交");
			htmlArr.push("	</div>");
			htmlArr.push("</div>");
			htmlArr.push("<div class=\"photo-bottom\">");
			htmlArr.push("	<div class=\"photo-bottom-div2\">");
			htmlArr.push("		<div class=\"photo-bottom-div21\">");
			htmlArr.push("			<form class=\"form-horizontal\" id=\"auditData\"> ");
			htmlArr.push("				<h4> ");
			htmlArr.push("					信息1<span class=\"bitian\">*</span>： ");
			htmlArr.push("				</h4> ");
			htmlArr.push("				<div class=\"form-group\"> ");
			htmlArr.push("					<div class=\"col-xs-12\"> ");
			htmlArr.push("						<label> <input type=\"radio\" name=\"ORG_PLAN_WORK\" ");
			htmlArr.push("							id=\"inlineRadio3\" value=\"1\"> 是 ");
			htmlArr.push("						</label> ");
			htmlArr.push("					</div> ");
			htmlArr.push("					<div class=\"col-xs-12\"> ");
			htmlArr.push("						<label> <input type=\"radio\" name=\"ORG_PLAN_WORK\" ");
			htmlArr.push("							id=\"inlineRadio4\" value=\"2\"> 否 ");
			htmlArr.push("						</label> ");
			htmlArr.push("					</div> ");
			htmlArr.push("				</div> ");
			htmlArr.push("				<h4> ");
			htmlArr.push("					信息2<span class=\"bitian\">*</span>： ");
			htmlArr.push("				</h4> ");
			htmlArr.push("				<div class=\"form-group\"> ");
			htmlArr.push("					<div class=\"col-xs-12 \"> ");
			htmlArr.push("						<label> <input type=\"radio\" name=\"ORG_PROJECT_COMPLETE\" ");
			htmlArr.push("							id=\"inlineRadio5\" value=\"1\"> 是 ");
			htmlArr.push("						</label> ");
			htmlArr.push("					</div> ");
			htmlArr.push("					<div class=\"col-xs-12 \"> ");
			htmlArr.push("						<label> <input type=\"radio\" name=\"ORG_PROJECT_COMPLETE\" ");
			htmlArr.push("							id=\"inlineRadio6\" value=\"2\"> 否 ");
			htmlArr.push("						</label> ");
			htmlArr.push("					</div> ");
			htmlArr.push("				</div> ");
			htmlArr.push("				<div id = \"CONSTRCUT_REMARK\"> ");
			htmlArr.push("					<h4> ");
			htmlArr.push("						信息3<span class=\"bitian\">*</span>： ");
			htmlArr.push("					</h4> ");
			htmlArr.push("					<div class=\"form-group\"> ");
			htmlArr.push("						<div class=\"col-xs-12 text-center\"> ");
			htmlArr.push("							<textarea class=\"form-control\" rows=\"2\" id=\"ORG_WORK_BACK\" ");
			htmlArr.push("								name=\"ORG_WORK_BACK\"></textarea> ");
			htmlArr.push("						</div> ");
			htmlArr.push("					</div> ");
			htmlArr.push("				</div> ");
			htmlArr.push("			</form> ");
			htmlArr.push("		</div>");		
			htmlArr.push("		<div class=\"modal-footer\"> ");
			htmlArr.push("			<div class=\"row\" id=\"foottwo\"> ");
			htmlArr.push("				<div class=\"sj-window-div4\"> ");
			htmlArr.push("					<input type=\"button\" id=\"submitbtn\" class=\"sj-window-qd\" value=\"操作6\">");
			htmlArr.push("				</div> ");
			htmlArr.push("			</div>");
			htmlArr.push("		</div> ");
			htmlArr.push("	</div> ");
			htmlArr.push("</div> ");
			return htmlArr;
		}
		/**
		 * 获取拍照点面板 拍照点照片信息部分html
		 */
		function getPhotoInfoHtml(pointArr,statusJso,i){
			var panlPhotoArr = new Array();
			var num1 = pointArr[i].PHOTO_TOTAL_NUM;
			var num2 = pointArr[i].PHOTO_UPLOAD_NUM;
			panlPhotoArr.push("	<div class=\"photo-bottom-div2\">");
			panlPhotoArr.push("		<div class=\"photo-bottom-div21\">");
			panlPhotoArr.push("			<h4>样例照片</h4>");				
			for(var j = 0; j < pointArr[i].INSTANCE_PHOTO_PATH.length; j++){
				var insUrl = pointArr[i].INSTANCE_PHOTO_PATH[j];
				if(j == 3){
					break;//最多加载三张示例照片
				}
				panlPhotoArr.push("		<div class=\"photo-inter-div1\">");
				panlPhotoArr.push("			<img src=\"" + insUrl
												 + "\" class=\"photo-inter-img1 show-big-img\" data-path=\"" 
													+ insUrl + "\"/>");
				panlPhotoArr.push("		</div>");
			}
			if(statusJso.takePhoto == "1"){//是否可以拍照
				panlPhotoArr.push("		<div class=\"photo-inter-div2 text-center \">");
				panlPhotoArr.push("			<img src=\"images/icon_camera.png\" id=\"takephoto\" class=\"photo-inter-img2\"/>");
				panlPhotoArr.push("		</div>");
			}
			panlPhotoArr.push("		</div>");
			panlPhotoArr.push("		<hr class=\"col-hr\"/>");
			panlPhotoArr.push("		<div class=\"photo-bottom-div22\">");
			if(statusJso.isInvolve == 1){
				panlPhotoArr.push("		<div>");
				panlPhotoArr.push("			<span class=\"photo-bottom-span1\">现场照片</span>");
				panlPhotoArr.push("			<span class=\"photo-bottom-span2\">");
				panlPhotoArr.push("			已拍摄" + num1 + "张  已上传" + num2 + "张</span>");
				if(statusJso.isUpload == "1"){
					panlPhotoArr.push("		<span class=\"photo-bottom-span3\" id=\"PHOTO_UPLOAD\" >上传</span>");
				}
				panlPhotoArr.push("		</div>");
				panlPhotoArr.push("		<div id=\"IMG_LIST\">");
				panlPhotoArr.push(			getYPPhotoHtml(pointArr,i));
				panlPhotoArr.push("		</div>");
			}else{
				panlPhotoArr.push("		<h4>" + pointArr[i].UNINVOLVE_REASON + "</h4>");
			}
			panlPhotoArr.push("		</div>");
			panlPhotoArr.push("	</div>");
			return panlPhotoArr;
		}
		/**
		 * 获取照片的展示div html
		 */
		function getYPPhotoHtml(pointArr,i){
			var j = 1;
			var imgListHtml = "";
			if(pointArr[i].SMALL_PHOTO_PATH.length == 0){
				imgListHtml = "<div style=\"height:100px;\"></div>";
			}
			for(var n = 0 ; n < pointArr[i].SMALL_PHOTO_PATH.length; n++){
				var smallPhotoUrl = pointArr[i].SMALL_PHOTO_PATH[n]||"";
				var bigPhotoUrl = pointArr[i].PHOTO_PATH[n]||"";
				if (j == 1) {
					imgListHtml += "<div class=\"row\" style=\"margin-top: 5px\">";
					imgListHtml += appendPhoto(smallPhotoUrl,bigPhotoUrl);				
					j++;
				} else if(j == 2){
					imgListHtml += appendPhoto(smallPhotoUrl,bigPhotoUrl);
					j++;
				} else if (j == 3) {
					imgListHtml += appendPhoto(smallPhotoUrl,bigPhotoUrl);
					imgListHtml += "</div>";
					j = 1;
				}
			}
			if(j != 3){
				imgListHtml += "</div>";
			}
			return imgListHtml;
		}
		/**
		 * 拼装图片格子
		 */
		function appendPhoto(smallPhotoUrl,bigPhotoUrl) {
			var str = "<div class=\"col-xs-4 col-md-4 \">"
			str += "<img class=\"show-big-img\" src=\""+ smallPhotoUrl +"\" style=\"width:100%;height:20%;\" data-path=\"" + bigPhotoUrl + "\">";
			str += "</div>";
			return str;
		}
		/**
		 * 获取拍照点面板 拍照点说明部分html
		 */
		function getPointInfoHtml(pointArr,statusJso,i){
			var panlArrPoint = new Array();
			var isbb = "";
			if(statusJso.isbp == "1"){
				isbb = "<span class=\"bitian\">*</span>";
			}
			panlArrPoint.push("	<div class=\"photo-bottom-div1\">");
			panlArrPoint.push("		<div class=\"photo-bottom-div11\">");
			panlArrPoint.push(			pointArr[i].POINT_NAME + isbb );
			panlArrPoint.push("		</div>");
			panlArrPoint.push("		<div class=\"photo-bottom-div12\">要求：</div>");
			panlArrPoint.push("		<div class=\"photo-bottom-div13\">");
			panlArrPoint.push(			pointArr[i].POINT_RULE);
			panlArrPoint.push("		</div>");
			panlArrPoint.push("	</div>");
			return panlArrPoint;
		}
		/**
		 * 获取拍照点面板 模板点信息部分html
		 */
		function getTemplateHtml(templateList,statusJso,i,pointNum,forNum){
			var pointArr = templateList[forNum].BO_CRITICAL_POINT_VER;
			var panlArrTem = new Array();
			var isSJ = "";
			var bsjReason = pointArr[i].UNINVOLVE_REASON || "";
			var pointId = pointArr[i].BO_CRITICAL_POINT_VER_ID||"";
			if( statusJso.isInvolve == 1){
				isSJ = "操作5-1";
			}else{
				isSJ = "操作5-2";
			}
			panlArrTem.push("<div class=\"" + statusJso.templateCss +"\">");
			panlArrTem.push("	<div class=\"photo-template-div1\"> ");		
			panlArrTem.push(		templateList[forNum].BO_CONTENT_NAME + " ");
			panlArrTem.push(		(i+1) + "/" + pointNum);
			panlArrTem.push("	</div>");
			panlArrTem.push("	<div class=\"photo-template-div2\" id=\"SJ_START\" ");
			panlArrTem.push("		date-yy=\"" + bsjReason +  "\" ");
			panlArrTem.push("		date-id=\"" + pointId +  "\" ");
			panlArrTem.push("		date-cz=\"" + statusJso.isShowInvolve +  "\" ");
			panlArrTem.push("		date-sj=\"" + statusJso.isInvolve +  "\" >");
			panlArrTem.push(		isSJ);
			panlArrTem.push("	</div>");
			panlArrTem.push("</div>");
			return panlArrTem;
		}
		/**
		 * 获取当前面板的按钮状态
		 */
		function gePhotoButtonStatus(pageJson,forNum,i){
			
			var templateList = pageJson.BO_TEMPLATE_DETAIL_VER;
			var isInvolve = templateList[forNum].BO_CRITICAL_POINT_VER[i].IS_INVOLVE||"0";//状态1
			var photoTotalNum = templateList[forNum].BO_CRITICAL_POINT_VER[i].PHOTO_TOTAL_NUM||"0";//状态2
			var photoUploadNum = templateList[forNum].BO_CRITICAL_POINT_VER[i].PHOTO_UPLOAD_NUM||"0";//状态3
			var isShowInvolve = "0";//状态4
			var isUpload = "0";//状态5
			var takePhoto = "0";//状态6
			var isSumbit = "0"//状态7
			if(pageJson.IS_EDIT == "1" && pageJson.TASK_STATE == "1"){
				isShowInvolve = "1"; 
				takePhoto = "1";	
				isSumbit = "1";		
			}
			if(pageJson.IS_EDIT == "1" && pageJson.TASK_STATE == "1"
				&& photoTotalNum > photoUploadNum){
				isUpload = "1"; 
			}		
			//状态6
			var isTakePhoto = templateList[forNum].BO_CRITICAL_POINT_VER[i].PHOTO_TOTAL_NUM !='0'?"1":"0";
			//状态8
			var isbp =templateList[forNum].BO_CRITICAL_POINT_VER[i].NEED_VALIDATE;

			var statusJso = {};
			statusJso.isShowInvolve	 = isShowInvolve;
			statusJso.isInvolve = isInvolve;
			statusJso.isUpload = isUpload;
			statusJso.takePhoto = takePhoto;
			statusJso.isTakePhoto = isTakePhoto;
			statusJso.isbp = isbp;
			statusJso.isSumbit = isSumbit;
			
			if(isInvolve != "1"){
				statusJso.templateCss = "photo-template-gray";
			}else{
				if(isTakePhoto == "1"){
					statusJso.templateCss = "photo-template-green";
				}else{
					statusJso.templateCss = "photo-template-blue";
				}
			}
			return statusJso;
		}
		/**
		 * 设置面板的自适应样式
		 */
		function showPhotoPanl(pageJson,panlJso) {
			var clientWidth = document.documentElement.clientWidth;
			var clientHeight = document.documentElement.clientHeight;
			var topDivHeight = $("#TOP_DIV").height();

			var photoPanlHtml = panlJso.photoPanlHtml;
			var panlNum = panlJso.panlNum * 1;
			
			if(clientWidth){
				clientWidth = clientWidth * 0.99;//100%会出现不可控的双滚动条
			}else{
				clientWidth = $(window).width() * 0.99;
			}

			$(".photo-div-base").css("width",clientWidth);//基础展示框宽度
			$(".photo-div-base").css("height",clientHeight - topDivHeight - 15);//基础展示框高度

			var panlWidth = clientWidth*0.95; //拍照点面板宽度
			$(".photo-div-x-scoll").css("width",(panlWidth + 2)*panlNum);//横向滚动宽度,要加上margin-left的2px;
			
			$("#PHOTO_X_SCOLL").html(photoPanlHtml);//加载panl内容

			$(".photo-div-panl").css("width",panlWidth);//设置panl的宽度
			var panlHeight = $(".photo-panl-base").height();		
			if(panlHeight && panlHeight > 0 ){
				$(".photo-bottom").css("height",panlHeight - 80);
			}
			var intPhotoWidth = $(".photo-inter-div1").width();
			if(intPhotoWidth&&intPhotoWidth>0){
				$(".photo-inter-div2").css("height",intPhotoWidth);
				$(".photo-inter-div1").css("height",intPhotoWidth);
			}
		}
		/**
		 * 操作0
		 */
		function viewProjectInfoHandler() {
			console.log("操作0");
		}
		/**
		  * 查看施工人员
		 */
		function viewuserHandler() {
			console.log("操作1");
			if($("#RYHS_IMG").attr("date-cz") == "0"){
				return;
			}
		}
		/**
		 * 操作2
		 */
		function problemReportHandler() {
			console.log("操作2");
			if($("#WTSB_IMG").attr("date-cz") == "0"){
				return;
			}
		}
		/**
		 * 操作3
		 */
		function signOutHandler() {
			console.log("操作3");
			if($("#GCQT_IMG").attr("date-cz") == "0"){
				return;
			}
		}
		/**
		  * 操作4
		 */
		function auditHandler(event) {
			console.log("操作4");
			if($("#RWTJ_IMG").attr("date-cz") == "0"){
				return;
			}
			document.getElementById("SUMBIT_PANL").scrollIntoView();
		};
		//拍照
		function takephoto(){
			console.log("拍照");
		}
		/**
		 * 操作5
		 */
		function submitHandler() {
			console.log("操作5");	
		}
		/**
		 * 是否展示涉及窗口
		 */
		function showSjWin(){
			var isShow = this.getAttribute("date-cz")||"0";//是否可以展示涉及窗口
			if(isShow == "0"){
				return;
			}

			var yy = this.getAttribute("date-yy")||"";
			var sj = this.getAttribute("date-sj")||"";
			var id = this.getAttribute("date-id")||"";
			
			$("#POINT_APPID").val(id);
			if(sj == "1"){
				$(".sj-window-div3").css("display","block");
				$(".sj-window-div2").html("不涉及理由");
				$("#BSJ_REASON").text(yy);
			}else{
				$(".sj-window-div3").css("display","none");
				$(".sj-window-div2").html("确定将该拍照点改为涉及吗？");
				$("#BSJ_REASON").text("");
			}
			$(".sj-window").css("display","block");			
		}
		function closeSjWin(){
			$(".sj-window").css("display","none");
		}
		/**
		 * 改变拍照点为涉及或者不涉及
		 */
		function dosjOrbsj(){
			var sj="0"; //0：不涉及， 1：涉及
			var yy=""; //不涉及原因
			var appid = $("#POINT_APPID").val();//拍照点id
			if(document.getElementById("SJ_DIV3").style.display == "none"){
				sj="1";
			}else{
				yy = $("#BSJ_REASON").val();
				if(!yy){
					alert("请填写不涉及原因！");
					return;
				}
			}
			var jso = {};
			jso.IS_INVOLVE = sj;
			jso.UNINVOLVE_REASON = yy;
			jso.BO_CRITICAL_POINT_VER_ID = appid;
		}
		//展示大图
		function showPicture() {
			var path = this.getAttribute('data-path');
			$("#BIG_PHOTO1").attr("src",path);
			$("#imgModal").show();
		}
		//关闭大图
		function closeImgMode(){
			$("#imgModal").css("display","none");
		}
		//上传图片
		function doUploadPhoto(){
			console.log("上传");
		}
		//面板滑动开始事件
		function doTouchStart(){
			var event = window.event;
			TouchPage.start_x = event.touches[0].clientX;
			TouchPage.start_y = event.touches[0].clientY;
		}
		/*
		 面板滑动后可以控制是否只滑动一个面板，适用于面板较少的情况
		 panlDom.previousSbiling存在undefined的情况，欢迎留言指正
		 */
		function doTouchEnd(){
			event = window.event;
			TouchPage.end_x = event.changedTouches[0].clientX;
			TouchPage.end_y = event.changedTouches[0].clientY;

			var id = $(this).attr("id");
			var panlDom = document.getElementById(id);

			if(TouchPage.end_x - TouchPage.start_x > 30){
				// if(panlDom.nextSbiling){
				// 	panlDom.nextSbiling.scrollIntoView();
				// }			
			}else if(TouchPage.end_x - TouchPage.start_x < -30){
				// if(panlDom.previousSbiling){
				// 	panlDom.previousSbiling.scrollIntoView();
				// }			
			}
		}
	}
});