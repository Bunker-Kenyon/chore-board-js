function test() {
    alert("Test");
    console.log("test");
}

function addNewReward() {
    console.log("addNewReward");
    $.ajax({
        url: '/getAddToRewardLibrary',
        type: 'post',
        data: { reward_name: $("#reward_name_input").val(), description: $("#reward_description_input").val() },
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

function deleteReward(rewardID) {
    console.log("deleteReward: " + rewardID);
    $.ajax({
        url: '/getDeleteFromRewardLibrary',
        type: 'post',
        data: { reward_library_id: rewardID },
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

function addNewChore() {
    var e = document.getElementById("rewards_input");
    console.log("addNewChore");
    console.log("Reward ID: " + e.value);
    $.ajax({
        url: '/getAddToChoreLibrary',
        type: 'post',
        data: { chore_name: $("#chore_name_input").val(), description: $("#chore_description_input").val(), xp_reward: $("#chore_xp_reward_input").val(), reward_library_id: e.value },
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

function deleteChore(choreID) {
    console.log("deleteChore: " + choreID);
    $.ajax({
        url: '/getDeleteFromChoreLibrary',
        type: 'post',
        data: { chore_library_id: choreID },
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

function fillRewardsDropdown() {
    console.log("fillRewardsDropdown");
    $.ajax({
        dataType: 'json',
        url: "/getRewardLibraryData",
        type: 'get',

        success: function(values) {
            //console.log(values);
            //var values = ["dog", "cat", "parrot", "rabbit"];
            /* for (const val of values) {
                console.log(val.reward_name);
            } */

            var select = document.getElementById("rewards_input");
            console.log(select);

            for (const val of values) {
                console.log(val.reward_name);
                var option = document.createElement("option");
                option.value = val.reward_library_id;
                option.text = val.reward_name;
                select.appendChild(option);
            }

            document.getElementById("rewards_input").appendChild(select);
        }
    })
}

function fillRewardsTable() {
    $.ajax({
        dataType: 'json',
        url: "/getRewardLibraryData",
        type: 'get',

        success: function(data) {

            var i = 0;
            var table = '<table class="table"><tr><th>Chore</th><th>Description<th>Action</th></tr>';
            $.each(data, function(key, obj) {
                var rewardID = obj.reward_library_id;
                table += ('<tr>');
                table += ('<td>' + obj.reward_name + '</td>');
                table += ('<td>' + obj.description + '</td>');
                table += ('<td><button type="submit" class="btn btn-danger" name="deleteReward" onclick="deleteReward(' + rewardID + ')">Delete</button><span> - </span><button type="submit" class="btn btn-warning" name=$rewardUpdateBtn>Update</button></td>');
                table += ('</tr>');
            });
            table += `<tr>
                    <td><input class="form-control" type="text" id="reward_name_input" name="reward_name_input"></td>
                    <td><input class="form-control" type="text" id="reward_description_input" name="reward_description_input"></td>
                    <td><button type="button" name="addNewReward" class="btn btn-primary" onclick="addNewReward()" >Add New Reward</button></td>
                    </tr></table>`;
            $("#rewardsContainer").html(table);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("some error" + errorThrown);
        }
    })
}

function fillChoresTable() {
    $.ajax({
        dataType: 'json',
        url: "/getChoreLibraryData",
        type: 'get',

        success: function(data) {
            var i = 0;
            var table = '<table class="table"><tr><th>Chore</th><th>Description</th><th>XP</th><th>Reward</th><th>Action</th></tr>';
            $.each(data, function(key, obj) {
                var choreID = obj.chore_library_id;
                table += ('<tr>');
                table += ('<td>' + obj.chore_name + '</td>');
                table += ('<td>' + obj.description + '</td>');
                table += ('<td>' + obj.xp_reward + '</td>');
                table += ('<td>Reward Name</td>');
                table += ('<td><button type="submit" class="btn btn-danger" name=deleteChore onclick="deleteChore(' + choreID + ')">Delete</button><span> - </span><button type=\"submit\" class=\"btn btn-warning\" name=$rewardUpdateBtn>Update</button></td>');
                table += ('</tr>');
            });
            table += `<td><input class="form-control" type="text" id="chore_name_input" name="chore_name_input"></td>
            <td><input class="form-control" type="text" id="chore_description_input" name="chore_description_input"></td>
            <td><input class="form-control" type="number" id="chore_xp_reward_input" name="chore_xp_reward_input"></td>
            <td><select class="form-control" id="rewards_input" name="rewards_input" onclick="fillRewardsDropdown(); this.onclick=null;">
            <td><button name="addNewChore" class="btn btn-primary" onclick="addNewChore()" >Add New Chore</button></td></table>`;
            $("#choresContainer").html(table);

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("some error" + errorThrown);
        }
    });
}

function populatePage() {
    fillRewardsTable();
    fillChoresTable();
    //fillRewardsDropdown();
}