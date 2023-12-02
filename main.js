import { fetchPost } from "./common/web.js";
import { serverUrl } from "./common/def_global.js";

var Organizations = [];
Init();
document.getElementById('organization').addEventListener('input', SearchOrg);
document.getElementById('btn_submit').addEventListener('click', SubmitData);

async function Init()
{
    const content = {
        "method": "initform"
    };
    var result = await fetchPost(serverUrl + '/api', content, "application/json");
    if(result[0] == 200)
    {
        Organizations = result[1].Organizations;
        const cityObj = document.getElementById('city');
        for(var i=0; i<result[1].Cities.length; i++)
        {
            var opt = document.createElement('option');
            opt.id = result[1].Cities[i].Name;
            opt.innerHTML = result[1].Cities[i].Name;
            cityObj.appendChild(opt);
        }
    }
}

function SearchOrg()
{
    var org = this.value.toLowerCase();
    var autocompleteList = document.getElementById("autocomplete-list");
    autocompleteList.innerHTML = "";
    if(org == "")
        return;

    var filtered = Organizations.filter(function(organization) {
        return organization.toLowerCase().indexOf(org) > -1;
    });
    filtered.forEach(function(organization) {
        var orgDiv = document.createElement("div");
        orgDiv.textContent = organization;
        orgDiv.addEventListener('click', orgClicked);
        autocompleteList.appendChild(orgDiv);
    });
}

function orgClicked()
{
    document.getElementById('organization').value = this.innerHTML;
    document.getElementById("autocomplete-list").innerHTML = '';
}

async function SubmitData()
{
    event.preventDefault(); //prevent reloading html

    var content = {
        "method": "submitdata",
        "data": {
            "Name": document.getElementById('name').value,
            "Term": document.getElementById('term').value,
            "City": document.getElementById('city').value,
            "Organization": document.getElementById('organization').value,
            "Unit": document.getElementById('unit').value,
            "Title": document.getElementById('title').value,
            "Email": document.getElementById('email').value
        }
    }
    if(content.data.Name == '' || content.data.Term == '' || content.data.City == ''
    || content.data.Organization == '' || content.data.Unit == '' || content.data.Title == ''
    || content.data.Email == '')
    {
        alert('請填寫完整資料');
        return;
    }
    var current = new Date();
    current = current.getFullYear() - 2011;
    if(content.data.Term > current)
    {
        alert('請確認所屬第幾屆，現有' + current + '屆');
        return;
    }
    if(content.data.Email.indexOf('@') == -1)
    {
        alert('請輸入完整Email');
        return;
    }

    var result = await fetchPost(serverUrl + '/api', content, "application/json");
    if(result[0] == 200) // Submit successfully
        document.location.href="./done.html";
}