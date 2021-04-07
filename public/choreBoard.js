function fillChoreDropdown() {
    console.log("fillChoreDropdown");
    $.ajax({
        dataType: 'json',
        url: "/getChoreLibraryData",
        type: 'get',

        success: function(values) {
            var select = document.getElementById("chores");

            for (const val of values) {
                console.log(val.reward_name);
                var option = document.createElement("option");
                option.value = val.chore_library_id;
                option.text = val.chore_name;
                select.appendChild(option);
            }

            //document.getElementById("chores").appendChild(select);
        }
    })
}

function fillUserDropdown() {
    console.log("fillUserDropdown");
    console.log(document.getElementById("users"));
    $.ajax({
        dataType: 'json',
        url: "/getUsersInHousehold",
        type: 'get',

        success: function(values) {
            var select = document.getElementById("users");
            for (const val of values) {
                var option = document.createElement("option");
                option.value = val.user_id;
                option.text = val.display_name;
                select.appendChild(option);
            }

            //document.getElementById("users").appendChild(select);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("some error" + errorThrown);
        }
    })
}

function fillAllUserDropdowns() {
    console.log("fillAllUserDropdowns");
    var usersDropDown = document.getElementsByClassName("usersdd");
    var i;

    $.each(usersDropDown, function(key, dropdown) {
        console.log(dropdown);
        $.ajax({
            dataType: 'json',
            url: "/getUsersInHousehold",
            type: 'get',

            success: function(values) {
                var select = document.getElementById(dropdown.id);
                console.log("Success");
                console.log()

                for (const val of values) {
                    console.log(val);
                    var option = document.createElement("option");
                    option.value = val.user_id;
                    option.text = val.display_name;
                    select.appendChild(option);
                }

                //document.getElementById(usersDropDown[i].id).appendChild(select);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("some error" + errorThrown);
            }
        })
    });
}

function populateChoreBoard() {
    fillChoreDropdown()
    fillUserDropdown();
    fillAllUserDropdowns();

}

function assignChore() {
    var userID = null;
    if ($("#users").val() == 'unassigned') {
        userID = null;
    } else {
        userID = $("#users").val();
    }
    //alert("ChoreID: " + $("#chores").val() + " UserID: " + userID);
    $.ajax({
        url: '/getAssignChore',
        type: 'post',
        data: { chore_library_id: $("#chores").val(), user_id: userID },
        jsonpCallback: 'callback',
        success: function(data) {
            console.log(data);
        },
        error: function(xhr, status, error) {
            console.log('Error: ' + error.message);
        }
    });
    location.reload(true);
}

function completeChore(choreID) {
    $.ajax({
        url: '/getCompleteChore',
        type: 'post',
        data: { chore_id: choreID },
        jsonpCallback: 'callback',
        success: function(data) {
            console.log(data);
        },
        error: function(xhr, status, error) {
            console.log('Error: ' + error.message);
        }
    });
    location.reload(true);
}

function assignUnassigedChores(btnID) {
    var choreID = parseInt(btnID.match(/\d+/));
    var userID = $("#users" + choreID).val();
    $.ajax({
        url: '/getAssignUnassigedChores',
        type: 'post',
        data: { chore_id: choreID, user_id: userID },
        jsonpCallback: 'callback',
        success: function(data) {
            console.log(data);
        },
        error: function(xhr, status, error) {
            console.log('Error: ' + error.message);
        }
    });
    location.reload(true);
}