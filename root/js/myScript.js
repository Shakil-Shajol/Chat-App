			var socket;
			$(function(){
			
			$('#btnjoin').click(function(){
				var un=$("#username").val();
				if(un=="")
				{
					$('#err').slideDown(500);
					$("#username").focus();
					return;
				}
				socket = io.connect('http://localhost:2020');
				socket.on('connect',function(){
					$("#login").hide();
					$("#chatbox").show();
					socket.emit("addMember",$("#username").val());
				});
				
				socket.on('message',function(data){
					$('#message').append('<li><p class="usname"><b>'+data.from+' : </b> </p><p class="mmm">'+data.content+'</p></li>');
				});
				
				socket.on('sendImage',function(user,image){
					$('#message').append('<li><p class="usname"><b>'+user+' : </b> </p><a target="_blank" href="' + image + '"><img width="200"  style="border-radius:10px" src="' + image + '" /></a></li>');
				});
				
				socket.on('memberjoin',function(user){
					$('#people').text(user.toString());
				});
			});
			$('#btnsend').click(function(){
				socket.emit("chat",$("#msg").val());
				$("#msg").val("");
				$("#msg").focus();
			});
			
			$('#msg').keypress(function(e){
				if (e.which == 13) {
                e.preventDefault();
                $(this).blur();
                socket.emit("chat",$("#msg").val());
				$("#msg").val("");
				$("#msg").focus();
            }
			});
			
				
				
				$(function () {
                $('#btnsendfile').on('change', function (e) {
                    var file = e.originalEvent.target.files[0];
                    var reader = new FileReader();
                    reader.onload = function (evt) {
                        socket.emit('addImage', evt.target.result);
                    };
                    reader.readAsDataURL(file);
                })
            })
			});